from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import logging
import json
import requests # gunakan requests daripada openai client

# setup logging untuk debugging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# memuat variabel lingkungan dari file .env
load_dotenv()

# inisialisasi aplikasi fastapi
app = FastAPI(title="AI Portfolio Backend")

# konfigurasi cors
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# model untuk request
class QuestionRequest(BaseModel):
    question: str

# model untuk response
class AIResponse(BaseModel):
    response: str

# data profil pengguna
user_profile = {
    "nama": "Danendra Shafi Athallah",
    "lokasi": "Jakarta, Indonesia",
    "keahlian": ["Next.js", "Python", "AI", "Data Science"],
    "hobi": ["Membaca", "Traveling"],
    "proyek": [
        "AI Sentiment Analyzer - Aplikasi analisis sentimen menggunakan NLP",
        "E-Commerce Dashboard - Dashboard untuk monitoring penjualan online",
        "Personal Finance Tracker - Aplikasi tracking keuangan pribadi"
    ],
    "karakter": "Kreatif, analitis, dan suka belajar hal baru"
}

# menyusun prompt dasar
def create_base_prompt(question: str) -> str:
    base_prompt = f"""
    Kamu adalah asisten pribadi dari {user_profile['nama']}. Jawab pertanyaan ini berdasarkan profil berikut:
    - Nama: {user_profile['nama']}
    - Lokasi: {user_profile['lokasi']}
    - Keahlian: {', '.join(user_profile['keahlian'])}
    - Hobi: {', '.join(user_profile['hobi'])}
    - Proyek unggulan: {', '.join(user_profile['proyek'])}
    - Karakter: {user_profile['karakter']}

    Pertanyaan pengguna: {question}

    Jawablah dengan bahasa Indonesia yang natural dan ramah. Berikan jawaban yang spesifik sesuai dengan informasi di profil.
    """
    return base_prompt

# fungsi helper untuk memanggil OpenAI API menggunakan requests
def call_openai_api(prompt):
    logger.info("mengirim permintaan ke openai via requests")
    api_key = os.getenv("OPENAI_API_KEY")
    
    if not api_key:
        logger.error("api key tidak ditemukan")
        raise ValueError("OpenAI API key tidak ditemukan")
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    
    payload = {
        "model": "gpt-3.5-turbo",
        "messages": [
            {"role": "system", "content": "Kamu adalah asisten virtual yang membantu menjawab pertanyaan tentang pemilik portfolio."},
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 500,
        "temperature": 0.7
    }
    
    try:
        response = requests.post(
            "https://api.openai.com/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=30  # timeout setelah 30 detik
        )
        
        if response.status_code != 200:
            logger.error(f"openai error: {response.status_code} - {response.text}")
            raise ValueError(f"OpenAI API error: {response.status_code}")
        
        result = response.json()
        if "choices" not in result or len(result["choices"]) == 0:
            logger.error("tidak ada hasil dari openai")
            raise ValueError("Tidak ada hasil dari OpenAI")
        
        return result["choices"][0]["message"]["content"]
    
    except requests.exceptions.RequestException as e:
        logger.error(f"request error: {str(e)}")
        raise ValueError(f"Error saat berkomunikasi dengan OpenAI: {str(e)}")

# endpoint untuk menerima pertanyaan dan mengembalikan respons
@app.post("/ask", response_model=AIResponse)
async def ask_ai(request: QuestionRequest):
    try:
        # log pertanyaan
        logger.info(f"pertanyaan diterima: {request.question}")
        
        # membuat prompt
        prompt = create_base_prompt(request.question)
        
        try:
            # coba panggil openai
            response_text = call_openai_api(prompt)
            logger.info("respons diterima dari openai")
            return AIResponse(response=response_text)
        except Exception as openai_error:
            # jika gagal, gunakan fallback
            logger.warning(f"fallback ke mock response: {str(openai_error)}")
            return await ask_ai_mock(request)
        
    except Exception as e:
        logger.error(f"error saat memproses permintaan: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Terjadi kesalahan: {str(e)}")

# endpoint mock untuk fallback
@app.post("/ask-mock", response_model=AIResponse)
async def ask_ai_mock(request: QuestionRequest):
    try:
        question = request.question.lower()
        
        if "keahlian" in question:
            response = f"Keahlian utama {user_profile['nama']} adalah {', '.join(user_profile['keahlian'])}. Dia sangat mahir dalam pengembangan web menggunakan Next.js dan memiliki pengetahuan yang baik tentang AI dan Data Science."
        elif "proyek" in question or "project" in question:
            response = f"Proyek unggulan {user_profile['nama']} adalah AI Sentiment Analyzer, sebuah aplikasi yang menggunakan NLP untuk menganalisis sentimen teks. Dia juga memiliki proyek E-Commerce Dashboard dan Personal Finance Tracker."
        elif "hobi" in question:
            response = f"{user_profile['nama']} memiliki hobi {' dan '.join(user_profile['hobi'])}. Dia suka menjelajahi tempat-tempat baru dan memperluas wawasannya melalui membaca."
        elif "ai" in question or "artificial intelligence" in question:
            response = f"{user_profile['nama']} memiliki keahlian dalam AI dan telah mengerjakan proyek seperti AI Sentiment Analyzer. Dia selalu mengikuti perkembangan teknologi AI terbaru."
        else:
            response = f"Sebagai asisten {user_profile['nama']}, saya dapat memberitahu bahwa dia adalah seorang profesional yang berbasis di {user_profile['lokasi']} dengan keahlian di bidang {', '.join(user_profile['keahlian'])}. Dia memiliki karakter yang {user_profile['karakter']}. Jika Anda memiliki pertanyaan yang lebih spesifik, silakan tanyakan!"
        
        return AIResponse(response=response)
    except Exception as e:
        logger.error(f"error saat memproses permintaan mock: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Terjadi kesalahan: {str(e)}")

# rute root untuk health check
@app.get("/")
async def root():
    return {"message": "AI Portfolio Backend berjalan. Gunakan endpoint /ask untuk bertanya."}

# menjalankan aplikasi
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)