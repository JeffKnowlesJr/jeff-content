# Project Image Setup Guide

This guide explains how to set up images for project documentation pages.

## Overview

Project images are stored in S3 and served via CloudFront for optimal performance. The `process-images.js` script handles both blog and project images automatically.

## Setup Instructions

### 1. Place Source Images

For project images, place your source images in one of these locations:
- `/public/content/assets/` (recommended)
- `/content/blog/assets/` (if shared with blog)
- Project root directory (for one-off uploads)

### 2. Update Project Markdown

In your project markdown file (e.g., `content/projects/project-pii-documentation.md`), ensure the frontmatter includes:

```yaml
featuredImage: '/images/projects/project-pii/cover.jpg'
thumbnailImage: '/images/projects/project-pii/cover.jpg'
contentImage: '/images/projects/project-pii/cover.jpg'
```

### 3. Run Image Processing

Execute the image processing script:

```bash
npm run process-images
```

This script will:
1. Find source images matching the project
2. Optimize and convert to WebP format
3. Upload to S3 with proper path structure
4. Update the markdown frontmatter with CloudFront URLs

### 4. Verify Results

After processing, your frontmatter should be updated to:

```yaml
featuredImage: 'https://d309xicbd1a46e.cloudfront.net/projects/project-pii.webp'
thumbnailImage: 'https://d309xicbd1a46e.cloudfront.net/projects/project-pii.webp'
contentImage: 'https://d309xicbd1a46e.cloudfront.net/projects/project-pii.webp'
```

## Project-Specific Instructions

### Project PII (Vibe System)

For the nick-hillier timer image:
1. Save `nick-hillier-yD5rv8_WzxA-unsplash.jpg` to `/public/content/assets/`
2. Rename to `project-pii.jpg` for automatic detection
3. Run `npm run process-images`

### Project Omega

Images should follow the pattern `project-omega.jpg` or `project-omega.png`

### Project Zero

Images should follow the pattern `project-zero.jpg` or `project-zero.png`

## Troubleshooting

If images aren't processing correctly:

1. **Check file naming**: Ensure the base name matches the project slug
2. **Verify paths**: Check that source images are in the correct directories
3. **Review script output**: Look for error messages about missing files
4. **Check AWS credentials**: Ensure S3 upload permissions are configured
5. **Force reprocess**: Set `FORCE_REPROCESS = true` in the script to override existing URLs

## S3 Structure

Project images are uploaded to:
```
s3://jeff-dev-blog-images/
  └── projects/
      ├── project-pii.webp
      ├── project-omega.webp
      └── project-zero.webp
```

## CloudFront Distribution

All images are served through CloudFront for global edge caching:
- Domain: `d309xicbd1a46e.cloudfront.net`
- Cache behavior: Optimized for images
- Compression: Automatic gzip/brotli 