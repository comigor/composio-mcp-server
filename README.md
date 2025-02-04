# Composio MCP Server

A Model Context Protocol (MCP) server implementation that exposes Composio tools and actions.

## Overview

This server provides MCP-compatible access to various Composio applications like Gmail, Linear, and more through a standardized interface. It allows language models to interact with these tools in a structured way.

## Prerequisites

- Node.js 16 or higher
- A Composio API key, get it here by signing up at https://app.composio.dev

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/composio/composio-mcp-server.git
   cd composio-mcp-server
   ```

2. Install dependencies and build the project:
   ```bash
   pnpm install && pnpm build
   ```

## Installation guide for composer 

   - Open Cursor Settings
   - Navigate to Features -> Add MCP Server
   - Add the following command:
     ```bash
     COMPOSIO_API_KEY=<composio_api_key> COMPOSIO_APPS=gmail,linear node /path/to/composio-mcp-server/build/index.js
     ```
   - Replace `/path/to/composio-mcp-server` with the actual path where you cloned the repository
   - Replace `<composio_api_key>` with your actual Composio API Key
   - Replace `<app1,app2,...>` with a comma-separated list of Composio apps you want to enable, such as `gmail,linear`
