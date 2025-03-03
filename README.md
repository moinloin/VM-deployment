# VM Deployment API

This project provides a lightweight system to automatically create, configure, and manage virtual machines on a Proxmox cluster. It consists of two main components:

Backend: A Flask-based API to provision VMs via Terraform and configure them via Ansible.
Frontend: A modern web interface to trigger deployments, destroy VMs and visualize deployment results.

## Architecture Overview

| Component        | Technology          |
|------------------|---------------------|
| Backend API      | Flask                |
| Infrastructure   | Terraform            |
| Configuration    | Ansible              |
| Frontend         | Node.js + Express + Vanilla JS |
| Containerization | Docker                |
| CI/CD            | GitHub Actions       |

## Backend - API Endpoints

### /deploy (POST)

Creates a new VM and configures it using Ansible.

The request body expects:
- `name`: Name of the VM
- `ip`: Static IP address for the VM
- `password`: Initial root password for the VM

The response contains:
- `status`: Success or failure
- `message`: Description
- `name` and `ip`: To confirm what was created

### /destroy (DELETE)

Deletes an existing VM and cleans up all associated files in the management directory.

The request body expects:
- `name`: Name of the VM to be destroyed

The response contains:
- `status`: Success or failure
- `message`: Description of the result

This ensures that both the VM in Proxmox and the corresponding Terraform and Ansible files are completely removed.

## Frontend - Web Interface

### Features

- Trigger new VM deployments
- Destroy existing VMs
- See real-time feedback from the backend (success/error messages)

### Technology Stack

| Area            | Technology         |
|-----------------|--------------------|
| Frontend Server | Node.js + Express  |
| Frontend UI     | HTML, CSS (Dark Mode), JavaScript |
| Styling         | Custom CSS |

## Completed Features

- [x] Deployment API available
- [x] Docker container fully functional
- [x] GitHub Actions pipeline in place
- [x] Proxmox integration via Terraform works
- [x] Automatic VM configuration with Ansible
- [x] Simple Web UI for Deployment Management

## Planned Features

- [ ] VM Status Overview Dashboard
- [ ] Notifications (Slack, email, webhook)
- [ ] Deployment History Logs

## Security

- Proxmox credentials are not stored in this repository.
- Secrets are injected via environment variables.
- Frontend does not talk directly to Proxmox — only the backend handles that.
- The whole system should only run inside a trusted management network.
