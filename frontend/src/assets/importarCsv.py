import requests
import os

BASE_URL = "http://localhost:8080/api/diario_saude"
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

headers_auth = {
    "Authorization": "Bearer eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJtYXJpYUBlbWFpbC5jb20iLCJpYXQiOjE3NjM1ODE4NDQsImV4cCI6MTc2NDE4NjY0NH0.U7eQbSFF78CReda8vMjS0tFX1BbghgvnmHraP3auU6pgfo_4Ve3wCjo4-n_xNHv3"
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
