variable "pm_url" {}

variable "pm_username" {}

variable "pm_password" {}

variable "proxmox_node" {}

variable "ssh_key" {}

variable "vm_name" {}

variable "vm_username" {
    description = "default name"
    default     = "debian"
  }

  variable "vm_password" {
      description = "default password"
      default     = "changeme"
    }

variable "static_ip_address" {
    description = "default ip"
    default     = "0.0.0.0/24"
  }

variable "static_ip_gateway" {}
