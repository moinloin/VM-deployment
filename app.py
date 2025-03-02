from flask import Flask, request, jsonify
import os
import shutil
import subprocess

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DEPLOYMENT_DIR = BASE_DIR
MANAGEMENT_DIR = os.path.join(BASE_DIR, "..", "VM-management")

@app.route("/deploy", methods=["POST"])
def deploy():
    data = request.json
    name = data.get("name")
    ip = data.get("ip")
    password = data.get("password")

    if not all([name, ip, password]):
        return jsonify({"error": "name, ip and password are required"}), 400

    target_dir = os.path.join(MANAGEMENT_DIR, name)

    if os.path.exists(target_dir):
        return jsonify({"error": f"VM {name} already exists"}), 409

    try:
        os.makedirs(target_dir)

        shutil.copytree(os.path.join(DEPLOYMENT_DIR, "terraform"), os.path.join(target_dir, "terraform"))
        shutil.copytree(os.path.join(DEPLOYMENT_DIR, "ansible"), os.path.join(target_dir, "ansible"))

        env = os.environ.copy()
        env["TF_VAR_static_ip_address"] = f"{ip}/24"
        env["TF_VAR_vm_name"] = name
        env["TF_VAR_vm_password"] = password

        tmp_dir = os.path.join(target_dir, "terraform", ".tmp")
        os.makedirs(tmp_dir, exist_ok=True)
        env["TMPDIR"] = tmp_dir

        subprocess.run(["terraform", "init"], cwd=os.path.join(target_dir, "terraform"), check=True, env=env)

        subprocess.run([
            "terraform", "apply", "-auto-approve",
            "-var", f"static_ip_address={ip}/24",
            "-var", f"vm_name={name}",
            "-var", f"vm_password={password}"
        ], cwd=os.path.join(target_dir, "terraform"), check=True, env=env)

        subprocess.run([
            "ansible-playbook",
            "-i", f"{ip},",
            "-e", 'ansible_ssh_common_args="-o StrictHostKeyChecking=no"',
            "-e", 'ansible_user=debian',
            "-e", f"vm_name={name}",
            "setup_vm.yml"
        ], cwd=os.path.join(target_dir, "ansible"), check=True)

        return jsonify({
            "status": "success",
            "message": "VM was created and configured successfully",
            "name": name,
            "ip": ip
        })

    except subprocess.CalledProcessError as e:
        error_message = e.stderr.decode("utf-8") if e.stderr else str(e)
        shutil.rmtree(target_dir, ignore_errors=True)
        return jsonify({
            "status": "error",
            "message": f"Deployment failed: {error_message}"
        }), 500

    except Exception as e:
        shutil.rmtree(target_dir, ignore_errors=True)
        return jsonify({
            "status": "error",
            "message": f"Unexpected error: {str(e)}"
        }), 500        

@app.route("/destroy", methods=["DELETE"])
def destroy():
    data = request.json
    name = data.get("name")

    if not name:
        return jsonify({"error": "name is required"}), 400

    target_dir = os.path.join(MANAGEMENT_DIR, name)

    if not os.path.exists(target_dir):
        return jsonify({"error": f"VM {name} does not exist"}), 404

    try:
        subprocess.run([
            "terraform", "destroy", "-auto-approve",
            "-var", f"vm_name={name}"
        ], cwd=os.path.join(target_dir, "terraform"), check=True)

        shutil.rmtree(target_dir)

        return jsonify({
            "status": "success",
            "message": f"VM {name} was successfully destroyed"
        })
    except subprocess.CalledProcessError as e:
        return jsonify({
            "status": "error",
            "message": f"Failed to destroy VM {name}: {e}"
        }), 500        

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
