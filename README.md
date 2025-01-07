# Alignmentor

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.0+-black.svg)](https://nextjs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0+-38B2AC.svg)](https://tailwindcss.com)
[![OpenAI](https://img.shields.io/badge/OpenAI-API-412991.svg)](https://openai.com)

## 🎥 Demo Video

Check out a short demo of Alignmentor in action! [Watch the Demo](https://youtu.be/n2d7F19gwQ4)

---

## Overview

Alignmentor is an AI-powered research paper exploration platform built with Next.js, TypeScript, and TailwindCSS. It leverages OpenAI's Assistants API to provide interactive, intelligent discussions about AI safety research papers. The application demonstrates the capabilities of Retrieval-Augmented Generation (RAG) in enhancing research paper comprehension.

While the initial focus is on AI safety, **Alignmentor is a scalable platform that can be adapted for any field of study**. From economics to biology, users can interact with research papers in real-time, making complex topics more accessible and engaging.

> **Important Note**: This is a demonstration project showcasing RAG capabilities and AI-assisted paper comprehension. While the code may not adhere to all production-level best practices, it effectively demonstrates the power of combining various AI and cloud technologies for educational purposes.

---

## Key Features

- 📚 **Interactive Paper Exploration Interface**: Engage with research papers dynamically.
- 🤖 **AI-Powered Research Assistant**: Utilize OpenAI's GPT-4o-mini model for intelligent discussions.
- 🔍 **Dynamic Paper Categorization**: Easily explore papers by categories such as "Scalable Oversight."
- 📑 **PDF Rendering and Navigation**: Seamlessly read and interact with papers in PDF format.
- 🔐 **Secure Authentication via Auth0**: Ensures user data security.
- ☁️ **AWS DynamoDB Integration**: Efficiently manage research papers and related metadata.
- 🎯 **Admin Interface**: Manage papers, users, and other administrative tasks.

---

## Project Structure

```
alignmentor/
│
├── app/                # Next.js 14+ app directory
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
│
├── components/         # Reusable React components
│   ├── ui/             # UI components
│   └── shared/         # Shared components
│
├── lib/                # Utility functions and configurations
│   ├── auth/           # Authentication utilities
│   ├── aws/            # AWS configurations
│   └── openai/         # OpenAI utilities
│
├── pages/              # Page components
│   ├── admin/          # Admin interface
│   ├── alignmentor/    # Paper categories
│   └── explorer/       # Paper exploration
│
├── public/             # Static assets
│   └── images/         # Image assets
│
└── styles/             # Global styles and Tailwind config
```

---

## Prerequisites

- Node.js 18+ and npm/yarn
- AWS Account with DynamoDB access
- OpenAI API account
- Auth0 account
- Basic understanding of RAG systems and vector databases

---

## Setup Instructions

### 1. Environment Configuration

Create a `.env.local` file in the root directory. Below is the template with descriptions (DO NOT use these example values):

```bash
# Auth0 Configuration
AUTH0_SECRET=           # 32-byte secret generated using: openssl rand -hex 32
AUTH0_BASE_URL=         # Your application's base URL (e.g., http://localhost:3000)
AUTH0_ISSUER_BASE_URL=  # Your Auth0 domain URL
AUTH0_CLIENT_ID=        # Your Auth0 application client ID
AUTH0_CLIENT_SECRET=    # Your Auth0 application client secret

# OpenAI Configuration
NEXT_PUBLIC_OPENAI_API_KEY=  # Your OpenAI API key

# AWS Configuration
NEXT_PUBLIC_AWS_ACCESS_KEY_ID=      # Your AWS access key ID
NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY=   # Your AWS secret access key
NEXT_PUBLIC_AWS_REGION=              # Your AWS region (e.g., us-east-1)
```

> **⚠️ Security Notice**: The `.env` values shown in the original project are for demonstration purposes only. In a production environment, you should:
> - Never commit `.env` files to version control
> - Use proper secret management services
> - Rotate keys regularly
> - Implement proper access controls
> - Use environment-specific configurations

### 2. AWS DynamoDB Setup

1. Create an AWS account if you haven't already
2. Navigate to IAM Console:
   - Create a new IAM user with programmatic access
   - Attach the `AmazonDynamoDBFullAccess` policy (restrict in production)
   - Save the access key ID and secret access key

3. Create DynamoDB Table:
   ```bash
   aws dynamodb create-table \
     --table-name alignmentor-papers \
     --attribute-definitions AttributeName=id,AttributeType=S \
     --key-schema AttributeName=id,KeyType=HASH \
     --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5
   ```

### 3. OpenAI Setup

1. Create an OpenAI account at [platform.openai.com](https://platform.openai.com)
2. Navigate to API settings
3. Create a new API key
4. Create a new assistant:
   - Model: gpt-4o-mini (exactly as specified)
   - Purpose: AI safety research paper analysis
   - Enable required capabilities

### 4. Installation

```bash
# Clone the repository
git clone https://github.com/timsankara/alignmentor.git

# Install dependencies
cd alignmentor
npm install

# Start development server
npm run dev
```

---

## License

The Alignmentor project is licensed under the MIT License:

```
MIT License

Copyright (c) 2025 timsankara

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🚀 Future Enhancements

One of the exciting enhancements planned for Alignmentor is the **integration of Jupyter Notebooks for each research paper**. This feature will allow users to:

- **Code along with the paper**: Implement concepts, run simulations, and test hypotheses directly.
- **Access pre-built notebooks**: Explore preloaded code snippets and visualizations.
- **Collaborate in real-time**: Share notebooks with peers for collaborative research.

Additional potential enhancements include:

- **Implementing a Vector Database**: Enhance the retrieval system with Pinecone or Weaviate.
- **Support for Multiple Research Domains**: Expand Alignmentor to cover domains such as economics, climate science, and biology.
- **Mobile-Optimized Version**: Provide a seamless experience on mobile devices.

If this is a feature you'd love to see, **reach out to us** and let us know your thoughts! Your feedback can help shape the future of Alignmentor.

---

## Support and Contact

For questions and support:

- Create an issue on [GitHub](https://github.com/timsankara/alignmentor/issues)
- Contact the project maintainer [@timsankara](https://github.com/timsankara)

---

*Note: This project is for demonstration purposes. Use API credits responsibly and ensure proper security measures before deploying to production.*

