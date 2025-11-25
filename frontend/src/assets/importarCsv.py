import requests
import os

BASE_URL = "http://localhost:8080/api/diario_saude"
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

headers_auth = {
    "Authorization": "Bearer eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJtYXJpYUBlbWFpbC5jb20iLCJpYXQiOjE3NjQwOTY3MDAsImV4cCI6MTc2NDcwMTUwMH0.vSrQxqG_KUX5R7Kc7glyYBwolpw7gXuM59qKyO6sFLWvyz0c_y2Ktfq_NF0mC1qg"
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
