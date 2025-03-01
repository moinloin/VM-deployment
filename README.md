# VM Deployment API

This project provides a lightweight Flask-based API to automate the creation of virtual machines on a Proxmox cluster using Terraform and Ansible.

## What it does

- Exposes an API endpoint to trigger VM creation.
- Uses Terraform to clone and configure the VM in Proxmox.
- Uses Ansible to provision and configure the VM after creation.
- Runs inside a Docker container on a self-hosted GitHub Actions runner.

## Technologies

- Flask (API)
- Terraform (VM creation)
- Ansible (VM configuration)
- Docker (containerized API)
- GitHub Actions (automated deployment)

## Current API

### POST `/deploy`
Creates a new VM based on a template and runs an Ansible playbook to configure it.

## To-Do

- Add `/destroy` endpoint to remove a VM via API.
- Add `/status` endpoint to check if a VM is running.
- Add a simple frontend to trigger deployments and see the current state.



