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
    subprocess.run(["terraform", "apply", "-auto-approve"], cwd=os.path.join(target_dir, "terraform"), check=True, env=env)

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

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
