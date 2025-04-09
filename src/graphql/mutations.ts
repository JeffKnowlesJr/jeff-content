export const createContactForm = /* GraphQL */ `
  mutation CreateContactForm($input: CreateContactFormInput!) {
    createContactForm(input: $input) {
      id
      name
      email
      subject
      message
      createdAt
      status
    }
  }
`
