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

    if not name or not ip:
        return jsonify({"error": "name and ip are required"}), 400

    target_dir = os.path.join(MANAGEMENT_DIR, name)

    if os.path.exists(target_dir):
        return jsonify({"error": f"VM {name} already exists"}), 409

    os.makedirs(target_dir)

    shutil.copytree(os.path.join(DEPLOYMENT_DIR, "terraform"), os.path.join(target_dir, "terraform"))
    shutil.copytree(os.path.join(DEPLOYMENT_DIR, "ansible"), os.path.join(target_dir, "ansible"))

    env = os.environ.copy()
    env["TF_VAR_static_ip_address"] = f"{ip}/24"

    tmp_dir = os.path.join(target_dir, "terraform", ".tmp")
    os.makedirs(tmp_dir, exist_ok=True)
    env["TMPDIR"] = tmp_dir

    subprocess.run(["terraform", "init"], cwd=os.path.join(target_dir, "terraform"), check=True, env=env)
    subprocess.run(["terraform", "apply", "-auto-approve"], cwd=os.path.join(target_dir, "terraform"), check=True, env=env)

    return jsonify({"VM was created successfully", "name": name, "ip": ip})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
