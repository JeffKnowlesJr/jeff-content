---
title: Building a Modern Portfolio Website with Next.js
slug: building-modern-portfolio
excerpt: >-
  How to build a performant, accessible, and visually appealing developer
  portfolio using Next.js, TypeScript, and TailwindCSS
author: Compiled with assistance from AI
tags:
  - Next.js
  - TypeScript
  - TailwindCSS
  - Portfolio
  - Web Development
readingTime: 11
featuredImage: >-
  https://d309xicbd1a46e.cloudfront.net/featured/hector-j-rivas-QNc9tTNHRyI-unsplash.webp
status: published
description: >-
  Trace the evolution of a developer portfolio from static HTML to React with
  AWS microservices. Learn practical steps for progressive enhancement while
  maintaining performance and scalability.
keywords:
  - modern portfolio website
  - React development
  - AWS microservices
  - Terraform infrastructure
  - component architecture
  - frontend evolution
  - serverless backend
  - GraphQL API
ogTitle: 'Building a Modern Portfolio: From Static HTML to AWS Microservices'
ogDescription: >-
  Follow my journey transforming a basic portfolio into a scalable React
  application with AWS microservices. Practical insights on progressive
  enhancement for developers.
ogImage: >-
  https://d309xicbd1a46e.cloudfront.net/featured/hector-j-rivas-QNc9tTNHRyI-unsplash.webp
ogType: article
twitterCard: summary_large_image
twitterCreator: '@jeffknowlesjr'
articleSection: Web Development
articleAuthor: Compiled with assistance from AI
datePublished: '2025-03-30'
dateModified: '2025-04-11'
sourceImageAsset: hector-j-rivas-QNc9tTNHRyI-unsplash.jpg
---

# Building a Modern Portfolio Website: From HTML to Microservices

In this comprehensive guide, I'll walk you through the evolution of my portfolio website, from a simple static HTML/CSS site to a modern React application powered by AWS microservices. This journey demonstrates how to progressively enhance a website while maintaining performance and user experience.

## The Beginning: Static HTML/CSS

Every developer's journey starts somewhere, and mine began with a simple static website. This foundation taught me the importance of:

- Clean, semantic HTML structure
- Responsive CSS design principles
- Performance optimization basics
- Web accessibility standards

## Evolution to React

The transition to React brought new possibilities and challenges:

1. **Component Reusability:** React's architecture promotes code reuse, reducing redundancy and improving maintainability.
2. **Maintainable Codebase:** React's structure and ecosystem facilitate a more organized codebase, emphasizing readability and simplicity.
3. **Future-Proofing:** React provides a solid foundation for dynamic features and future enhancements.
4. **Improved Developer Experience:** React's tooling enhances developer productivity.

### Key Changes

1. **Project Structure:**

   ```
   src/
   ├── components/
   │   ├── common/
   │   │   ├── Card.tsx
   │   │   └── Button.tsx
   │   └── layout/
   │       ├── Header.tsx
   │       └── Footer.tsx
   ├── pages/
   │   ├── Home.tsx
   │   ├── About.tsx
   │   └── Contact.tsx
   └── styles/
       └── globals.css
   ```

2. **Component-Based Architecture:**

   ```typescript
   interface CardProps {
     title: string
     content: string
     image?: string
     link?: string
     state?: 'minimized' | 'normal' | 'expanded' | 'maximized'
   }

   const Card: React.FC<CardProps> = ({
     title,
     content,
     image,
     link,
     state
   }) => {
     // Component implementation
   }
   ```

3. **Styling with Tailwind CSS:**
   - Utility-first approach for rapid styling
   - Responsive design for optimal viewing
   - Dark/light mode support
   - Custom component styles

## Adding Backend Services with AWS Amplify

To add backend functionality, we integrated AWS Amplify, focusing on the contact form feature. This integration was approached with code quality principles in mind, aiming for clear separation of concerns and minimal code duplication.

### AWS Amplify Integration

1. **Initial Setup:**

   ```bash
   npm install aws-amplify
   npm install @aws-amplify/cli -g
   amplify init
   ```

2. **Configuration:**

   ```typescript
   // src/config/amplify.ts
   import { Amplify } from 'aws-amplify'
   import awsconfig from './aws-exports'

   Amplify.configure(awsconfig)
   ```

3. **GraphQL Schema:**
   ```graphql
   type ContactForm @model @auth(rules: [{ allow: public }]) {
     id: ID!
     name: String!
     email: String!
     message: String!
     createdAt: AWSDateTime!
     status: String!
   }
   ```

## Scaling with Microservices and Terraform

To enhance scalability and maintainability, we evolved the application using AWS microservices and infrastructure as code with Terraform. This architecture was designed with code quality principles in mind, aiming for clear service boundaries and minimal dependencies.

### Microservices Architecture

1. **Components:**

   - AppSync API (GraphQL) for request processing
   - DynamoDB (Data Storage) for persistent data
   - Lambda (Serverless Processing) for event-driven processing
   - SES (Email Service) for sending notifications

2. **Infrastructure as Code:**

   ```hcl
   # terraform/main.tf
   resource "aws_appsync_graphql_api" "contact_form" {
     name = "${var.project_name}-${var.environment}-api"
     authentication_type = "API_KEY"
     schema = file("${path.module}/schema.graphql")
   }

   resource "aws_dynamodb_table" "contact_form" {
     name = "${var.project_name}-${var.environment}-forms"
     hash_key = "id"
     range_key = "createdAt"
     stream_enabled = true
     stream_view_type = "NEW_AND_OLD_IMAGES"
   }
   ```

## Conclusion

This journey demonstrates the evolution of a portfolio website from a simple static site to a modern, scalable application. The key takeaways include:

- Progressive enhancement for continuous improvement
- Modern development practices for efficient development
- Infrastructure as code for automated infrastructure management
- Scalable architecture for handling increased traffic and complexity

## Next Steps

The journey doesn't end here. Future improvements include:

- Performance optimization
- Additional features
- Monitoring improvements
- Cost optimization

By continuing to embrace both progressive enhancement and code quality principles, we ensure that the codebase remains a valuable asset for years to come.
