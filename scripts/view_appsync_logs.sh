#!/bin/bash

# Prevent Git Bash path conversion
export MSYS_NO_PATHCONV=1

# Set variables from the previous script for consistency
API_ID="p2s524zsande3cecseghtsxo5a"
REGION="us-east-1"
LOG_GROUP_NAME="/aws/appsync/apis/$API_ID"

# Function to display usage instructions
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo "Options:"
    echo "  -t, --tail         Continuously tail the logs (live monitoring)"
    echo "  -l, --last-mins N  Show logs from the last N minutes (default: 60)"
    echo "  -e, --errors       Show only error messages"
    echo "  -q, --query       Filter logs by GraphQL query name"
    echo "  -h, --help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 --tail                    # Live monitoring of all logs"
    echo "  $0 --last-mins 30            # Show logs from last 30 minutes"
    echo "  $0 --errors --last-mins 120  # Show errors from last 2 hours"
    echo "  $0 --query createContact     # Show logs for createContact query"
}

# Default values
TAIL_MODE=false
LAST_MINS=60
FILTER_ERRORS=false
QUERY_FILTER=""

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -t|--tail)
            TAIL_MODE=true
            shift
            ;;
        -l|--last-mins)
            LAST_MINS="$2"
            shift 2
            ;;
        -e|--errors)
            FILTER_ERRORS=true
            shift
            ;;
        -q|--query)
            QUERY_FILTER="$2"
            shift 2
            ;;
        -h|--help)
            show_usage
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
done

# Calculate start time in milliseconds
START_TIME=$(($(date +%s) - LAST_MINS * 60))000

# Build filter pattern
FILTER_PATTERN=""
if [ "$FILTER_ERRORS" = true ]; then
    FILTER_PATTERN="error"
fi
if [ ! -z "$QUERY_FILTER" ]; then
    # Convert query to a simple pattern that works with CloudWatch Logs
    QUERY_FILTER=$(echo "$QUERY_FILTER" | sed 's/_/\\_/g')
    FILTER_PATTERN="$FILTER_PATTERN $QUERY_FILTER"
fi

# Function to format the log output
format_logs() {
    # Use jq to parse and format JSON logs if available
    if command -v jq &> /dev/null; then
        jq -r '. | "\(.timestamp) [\(.logLevel)] \(.message)"' 2>/dev/null || cat
    else
        cat  # Fallback to raw output if jq is not available
    fi
}

echo "Fetching logs from $LOG_GROUP_NAME..."
echo "Time range: Last $LAST_MINS minutes"
if [ ! -z "$FILTER_PATTERN" ]; then
    echo "Filter pattern: $FILTER_PATTERN"
fi

# Build the AWS CLI command
CMD="aws logs"
if [ "$TAIL_MODE" = true ]; then
    echo "Starting live log monitoring (Ctrl+C to exit)..."
    CMD="$CMD tail"
else
    CMD="$CMD filter-log-events"
fi

# Execute the command with proper quoting
if [ ! -z "$FILTER_PATTERN" ]; then
    $CMD \
        --log-group-name "$LOG_GROUP_NAME" \
        --start-time $START_TIME \
        --filter-pattern "$FILTER_PATTERN" \
        --region $REGION | format_logs
else
    $CMD \
        --log-group-name "$LOG_GROUP_NAME" \
        --start-time $START_TIME \
        --region $REGION | format_logs
fi 