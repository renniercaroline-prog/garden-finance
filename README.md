To run backend:

```
cd backend
python3 -m venv .venv                                                              
source .venv/bin/activate
python -m pip install -U pip
pip install -r requirements.txt
uvicorn app.main:app --reload 
```
