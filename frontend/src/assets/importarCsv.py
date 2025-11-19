import requests
import json
import os

BASE_URL = "http://localhost:8080/api/diario_saude"
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

headers_auth = {
    "Authorization": "Bearer eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJtYXJpYUBlbWFpbC5jb20iLCJpYXQiOjE3NjMxNDgyOTUsImV4cCI6MTc2Mzc1MzA5NX0.Bfs0H3jlRz_82lLXTa5yI3SFPUWMLijEWnrroc4hl2Jw4crypNTzWzgX_xP00Izr"
}

# --- Importar Doenças (CSV) ---
with open(os.path.join(BASE_DIR, "CID-10-SUBCATEGORIAS.csv"), "rb") as f:
    files = {"arquivo": f}
    resp = requests.post(f"{BASE_URL}/doencas/importar-csv", files=files, headers=headers_auth)
    print("Doenças:", resp.status_code, resp.text)

# --- Importar Medicamentos (CSV) ---
with open(os.path.join(BASE_DIR, "DADOS_ABERTOS_MEDICAMENTOS.csv"), "rb") as f:
    files = {"file": f}
    resp = requests.post(f"{BASE_URL}/medicamentos/import", files=files, headers=headers_auth)
    print("Medicamentos:", resp.status_code, resp.text)

# --- Importar Alergias (JSON) ---
with open(os.path.join(BASE_DIR, "alergias.json"), "r", encoding="utf-8") as f:
    alergias = json.load(f)

resp = requests.post(
    f"{BASE_URL}/alergia/criar-multiplas",
    headers={**headers_auth, "Content-Type": "application/json"},
    json=alergias
)
print("Alergias:", resp.status_code, resp.text)
