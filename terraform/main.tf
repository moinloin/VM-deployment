terraform {
  required_providers {
    proxmox = {
      source  = "bpg/proxmox"
      version = ">= 0.73.0"
    }
  }
}

resource "random_id" "vm_suffix" {
  byte_length = 4
}

provider "proxmox" {
  endpoint = var.pm_url
  username = var.pm_username
  password = var.pm_password
  insecure = true
}

resource "proxmox_virtual_environment_vm" "vm" {
  node_name = var.proxmox_node
  name      = "vm-${random_id.vm_suffix.hex}"

  clone {
    vm_id = 9000
    full  = false
  }

  agent {
    enabled = false
  }

  cpu {
    cores = 2
  }

  memory {
    dedicated = 4096
  }

  network_device {
    bridge = "vmbr0"
    model  = "virtio"
  }

  initialization {
    datastore_id = "local-zfs"

    ip_config {
      ipv4 {
        address = "dhcp"
      }
    }

    user_account {
      username = var.pm_vm_username
      password = var.pm_vm_password
      keys     = [var.ssh_key]
    }
  }
}
