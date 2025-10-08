# About This Project

This project is an AI-powered PDF reader and assistant for La Consolacion College Bacolod.

With this app, you can:

- **Summarize PDF documents** using advanced Python AI models.
- **Ask questions** about your PDFs and get instant answers.
- **Chat with your documents** for a more interactive reading experience.

Built with Next.js and Python, this app combines modern web technologies and AI to help you work with documents smarter and faster.

# Getting Started

**Disclaimer:** This project does **not** collect any user data. All data is processed and stored locally on your machine.

## How to Run the Python API and Nextjs

1. Open this repository in your Codespace or clone to UBUNTU WSL.

2. In your terminal, run:

    ```sh
    ./setup.sh
    ```

3. Once setup is complete, open the web app

   [http://localhost:3000/](http://localhost:3000/)

## Config the RPC_Endpoint

1. Get your RPC at https://portal.cdp.coinbase.com/products/address-history

2. Config and Update the RPC_Endpoint in /src/app/config/conf/setting.json.

---

## Architecture Overview

LLCB AI is a modular AI project built using a **Service-Oriented Architecture (SOA)** approach.  
It integrates Web3 services, Python APIs, and frontend components for a scalable and maintainable system.


```mermaid
flowchart TD
    subgraph Frontend
        A["App Components (Banner, Chat Bot, Header, Footer)"]
    end

    subgraph Config
        B["Config Files (CSS, Settings, Globals)"]
    end

    subgraph Backend_JS
        C["Modules & Services (API Fetch, Wagmi, Utilities)"]
        D["Web3 Providers (Wallet, Transactions)"]
    end

    subgraph Backend_Python
        E["Python API Server & Utilities (checkGPU, sample.py)"]
        F["Uploads Storage (tmp/lccb_ai_uploads)"]
    end

    %% Connections
    A --> C
    A --> B
    C --> D
    C --> E
    E --> F

