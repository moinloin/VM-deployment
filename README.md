# VM Deployment API

This project provides a lightweight API to automatically create and configure virtual machines on a Proxmox cluster. The API acts as a wrapper around Terraform and Ansible, combining infrastructure provisioning and configuration management into a simple HTTP interface.

## What does this API do?

- Provides a simple REST API to trigger VM creation.
- Uses Terraform to clone a Proxmox template, configure resources, and set up networking.
- Runs an Ansible playbook immediately after creation to configure the VM.
- Runs inside a Docker container to ensure portability.
- Deploys automatically via GitHub Actions whenever changes are pushed.

## Technology Stack

| Area                  | Tool                     |
|-----------------|------------------|
| API                         | Flask                    |
| Infrastructure     | Terraform             |
| Configuration | Ansible               |
| Container          | Docker                  |
| Deployment    | GitHub Actions |

## API Endpoints

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


## Completed Features

- [x] Deployment API available
- [x] Docker container fully functional
- [x] GitHub Actions pipeline in place
- [x] Proxmox integration via Terraform works
- [x] Automatic VM configuration with Ansible

## Planned Features

- [ ] Add a simple web frontend for triggering deployments and checking VM status
- [ ] Notifications (Slack, email, webhook)

## Security

- Proxmox credentials are **not** stored in the repository.
- All secrets are injected via environment variables.
- Ansible connects using the credentials provisioned by Terraform during VM creation.
- This API is intended to run inside a trusted management network, not exposed publicly.
