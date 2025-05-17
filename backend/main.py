from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import logging
import json
import requests
import random

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

# data profil pengguna yang lebih kaya
user_profile = {
    "nama": "Danendra Shafi Athallah",
    "lokasi": "Jakarta, Indonesia",
    "pendidikan": "Institut Teknologi Bandung, Teknik Informatika",
    "pekerjaan": "Frontend Developer di TechCorp Indonesia",
    "pengalaman": "3 tahun pengalaman di pengembangan web dan 2 tahun di data science",
    "keahlian": ["Next.js", "React", "Python", "AI", "Data Science", "TensorFlow", "Tailwind CSS"],
    "keahlian_detail": {
        "Next.js": "Framework utama yang digunakan untuk hampir semua proyek web dalam 2 tahun terakhir",
        "React": "Library JavaScript favorit untuk membangun UI yang interaktif",
        "Python": "Bahasa pemrograman utama untuk analisis data dan backend",
        "AI": "Berpengalaman dengan model-model GPT dan implementasi NLP",
        "Data Science": "Analisis data menggunakan pandas, matplotlib, dan scikit-learn"
    },
    "hobi": ["Membaca buku sci-fi", "Traveling ke destinasi lokal", "Fotografi urban", "Hiking di akhir pekan"],
    "hobi_detail": {
        "Membaca": "Buku favorit termasuk 'Dune' dan karya-karya Ted Chiang",
        "Traveling": "Sudah mengunjungi 8 provinsi di Indonesia dan berencana menambah lagi",
        "Fotografi": "Memiliki akun Instagram khusus untuk hasil foto urban landscape",
        "Hiking": "Mendaki Gunung Rinjani pada 2022 dan Gunung Semeru pada 2023"
    },
    "proyek": [
        "AI Sentiment Analyzer - Aplikasi analisis sentimen menggunakan NLP",
        "E-Commerce Dashboard - Dashboard untuk monitoring penjualan online",
        "Personal Finance Tracker - Aplikasi tracking keuangan pribadi",
        "Smart Home Controller - Sistem kontrol perangkat rumah berbasis IoT dan AI"
    ],
    "proyek_detail": {
        "AI Sentiment Analyzer": "Proyek ini menggunakan model BERT untuk menganalisis sentimen dari ulasan pengguna dengan akurasi 92%. Diimplementasikan dengan Python, TensorFlow, dan Flask. Digunakan oleh sebuah marketplace lokal untuk memonitor feedback pelanggan secara real-time.",
        "E-Commerce Dashboard": "Dashboard yang menampilkan metrik penjualan, tren produk, dan perilaku pengguna. Dibuat dengan Next.js, Chart.js, dan terintegrasi dengan API berbagai platform e-commerce. Meningkatkan efisiensi pengambilan keputusan bisnis sebesar 35%.",
        "Personal Finance Tracker": "Aplikasi web yang membantu pengguna melacak pengeluaran, mengatur anggaran, dan memvisualisasikan kebiasaan finansial. Menggunakan React, Firebase, dan D3.js untuk visualisasi data yang interaktif.",
        "Smart Home Controller": "Sistem yang mengintegrasikan berbagai perangkat IoT di rumah dengan kontrol berbasis AI. Menggunakan Raspberry Pi, Python, dan TensorFlow Lite untuk prediksi kebiasaan pengguna dan optimalisasi penggunaan energi."
    },
    "karakter": "Kreatif, analitis, detail-oriented, dan suka belajar hal baru",
    "prestasi": [
        "Juara 2 Hackathon Nasional 2022",
        "Speaker di TechConf Jakarta 2023",
        "Kontributor open source di beberapa proyek React"
    ],
    "quotes_favorit": [
        "Code is like humor. When you have to explain it, it's bad.",
        "The best way to predict the future is to create it.",
        "Simplicity is the ultimate sophistication."
    ],
    "rencana_masa_depan": "Fokus memperdalam keahlian di bidang AI dan machine learning, sambil mengembangkan produk digital yang memiliki dampak sosial positif."
}

# menyusun prompt dasar yang lebih kaya
def create_base_prompt(question: str) -> str:
    base_prompt = f"""
    Kamu adalah asisten pribadi dari {user_profile['nama']} yang cerdas, ramah, dan informatif. Jawab pertanyaan ini berdasarkan profil berikut:
    
    PROFIL LENGKAP:
    - Nama: {user_profile['nama']}
    - Lokasi: {user_profile['lokasi']}
    - Pendidikan: {user_profile['pendidikan']}
    - Pekerjaan saat ini: {user_profile['pekerjaan']}
    - Pengalaman: {user_profile['pengalaman']}
    - Keahlian: {', '.join(user_profile['keahlian'])}
    - Hobi: {', '.join(user_profile['hobi'])}
    - Proyek unggulan: {', '.join(user_profile['proyek'])}
    - Prestasi: {', '.join(user_profile['prestasi'])}
    - Karakter: {user_profile['karakter']}
    - Rencana masa depan: {user_profile['rencana_masa_depan']}
    
    DETAIL KEAHLIAN:
    {json.dumps(user_profile['keahlian_detail'], indent=2, ensure_ascii=False)}
    
    DETAIL PROYEK:
    {json.dumps(user_profile['proyek_detail'], indent=2, ensure_ascii=False)}
    
    DETAIL HOBI:
    {json.dumps(user_profile['hobi_detail'], indent=2, ensure_ascii=False)}
    
    Pertanyaan pengguna: {question}
    
    Jawablah dengan bahasa Indonesia yang natural, ramah, dan informatif. Berikan jawaban yang spesifik sesuai dengan informasi di profil. Variasikan struktur kalimat dan gaya bicara untuk terdengar lebih natural dan manusiawi. Gunakan sedikit humor yang ringan jika sesuai. Bila pertanyaan di luar konteks profil, jelaskan bahwa kamu hanya bisa memberikan informasi sesuai profil yang tersedia.
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
            {"role": "system", "content": "Kamu adalah asisten virtual yang membantu menjawab pertanyaan tentang pemilik portfolio dengan cara yang personal, informatif, dan sedikit humoris."},
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 800,
        "temperature": 0.8  # meningkatkan variasi output
    }
    
    try:
        response = requests.post(
            "https://api.openai.com/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=30
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

# endpoint mock yang lebih kaya dan variatif
@app.post("/ask-mock", response_model=AIResponse)
async def ask_ai_mock(request: QuestionRequest):
    try:
        question = request.question.lower()
        
        # kumpulan variasi pembuka untuk respons
        pembuka = [
            f"Hai! Sebagai asisten {user_profile['nama']}, ",
            f"Senang kamu bertanya! ",
            f"Oke, jadi tentang itu... ",
            f"Hmm, pertanyaan bagus! ",
            f"Izinkan saya memberitahu kamu, ",
            f"Menarik sekali pertanyaannya! "
        ]
        
        # kumpulan variasi penutup untuk respons
        penutup = [
            f" Semoga info ini membantu!",
            f" Ada hal lain yang ingin kamu ketahui?",
            f" Silakan tanya lebih detail jika kamu mau!",
            f" Jangan ragu untuk bertanya lebih lanjut ya!",
            f"",
            f" Bagaimana menurutmu?"
        ]
        
        # variasi respons berdasarkan kategori pertanyaan
        if any(word in question for word in ["keahlian", "skill", "bisa", "kemampuan", "ahli"]):
            responses = [
                f"{user_profile['nama']} sangat ahli dalam bidang {', '.join(user_profile['keahlian'][0:3])}. Khususnya di Next.js, dia sudah menggunakannya untuk hampir semua proyek webnya dalam 2 tahun terakhir.",
                f"Keahlian utama {user_profile['nama']} adalah di bidang {random.choice(user_profile['keahlian'])} dan {random.choice(user_profile['keahlian'])}. Dia juga cukup menguasai {user_profile['keahlian_detail']['Python']}.",
                f"{user_profile['nama']} punya keahlian yang kuat di {user_profile['keahlian'][0]} dengan pengalaman {user_profile['pengalaman']}. Dia juga memperdalam skill di bidang {user_profile['keahlian'][3]} dan {user_profile['keahlian'][4]} belakangan ini."
            ]
            response = random.choice(pembuka) + random.choice(responses) + random.choice(penutup)
            
        elif any(word in question for word in ["proyek", "project", "karya", "portfolio", "aplikasi"]):
            project = random.choice(list(user_profile['proyek_detail'].keys()))
            responses = [
                f"Salah satu proyek kebanggaan {user_profile['nama']} adalah {project}. {user_profile['proyek_detail'][project]}",
                f"{user_profile['nama']} telah mengerjakan beberapa proyek menarik, tapi yang paling dibanggakan adalah {project}. {user_profile['proyek_detail'][project]}",
                f"Proyek {project} mungkin yang paling mencerminkan kemampuan {user_profile['nama']}. {user_profile['proyek_detail'][project]}"
            ]
            response = random.choice(pembuka) + random.choice(responses) + random.choice(penutup)
            
        elif any(word in question for word in ["hobi", "suka", "waktu luang", "kegiatan", "aktivitas"]):
            hobi = random.choice(list(user_profile['hobi_detail'].keys()))
            responses = [
                f"{user_profile['nama']} memiliki beberapa hobi menarik, terutama {hobi}. {user_profile['hobi_detail'][hobi]}",
                f"Di waktu luangnya, {user_profile['nama']} suka {hobi.lower()}. {user_profile['hobi_detail'][hobi]}",
                f"Ketika tidak sedang coding, {user_profile['nama']} menghabiskan waktu untuk {hobi.lower()} dan {random.choice(user_profile['hobi']).lower()}."
            ]
            response = random.choice(pembuka) + random.choice(responses) + random.choice(penutup)
            
        elif any(word in question for word in ["ai", "artificial intelligence", "machine learning", "ml", "kecerdasan"]):
            responses = [
                f"{user_profile['nama']} punya ketertarikan besar pada AI. Dia telah mengerjakan proyek {user_profile['proyek'][0]} yang menggunakan NLP dan model machine learning untuk analisis sentimen.",
                f"Pengalaman {user_profile['nama']} dengan AI cukup dalam, terutama di area NLP. Proyek AI Sentiment Analyzer adalah contoh bagaimana dia mengimplementasikan teknologi ini secara praktis.",
                f"AI adalah salah satu fokus utama {user_profile['nama']} saat ini. Dia menggabungkan keahlian frontend-nya dengan AI untuk membuat aplikasi yang lebih pintar dan intuitif. Bahkan, rencana masa depannya adalah {user_profile['rencana_masa_depan']}"
            ]
            response = random.choice(pembuka) + random.choice(responses) + random.choice(penutup)
            
        elif any(word in question for word in ["pendidikan", "sekolah", "kuliah", "belajar", "kampus"]):
            responses = [
                f"{user_profile['nama']} adalah lulusan {user_profile['pendidikan']}. Pendidikan formalnya memberi dasar kuat untuk karir di bidang teknologi.",
                f"Untuk pendidikannya, {user_profile['nama']} menempuh studi di {user_profile['pendidikan']}. Di sana dia mulai mengembangkan minat di bidang programming dan data science.",
                f"{user_profile['nama']} belajar di {user_profile['pendidikan']}, tapi banyak keahliannya juga didapat dari pembelajaran mandiri dan proyek-proyek yang dikerjakannya."
            ]
            response = random.choice(pembuka) + random.choice(responses) + random.choice(penutup)
            
        elif any(word in question for word in ["prestasi", "pencapaian", "award", "penghargaan"]):
            prestasi = random.choice(user_profile['prestasi'])
            responses = [
                f"{user_profile['nama']} cukup berbangga dengan prestasinya sebagai {prestasi}. Ini adalah pengakuan atas keahlian dan dedikasinya di bidang teknologi.",
                f"Salah satu pencapaian yang patut dibanggakan adalah {prestasi}. Ini menunjukkan kemampuan {user_profile['nama']} dalam menerapkan keahlian teknisnya secara praktis.",
                f"Prestasi yang mungkin patut disebutkan adalah {prestasi}. {user_profile['nama']} selalu berusaha untuk berkontribusi dan berbagi pengetahuannya dengan komunitas."
            ]
            response = random.choice(pembuka) + random.choice(responses) + random.choice(penutup)
            
        elif any(word in question for word in ["karakter", "kepribadian", "sifat", "tipe", "mbti"]):
            responses = [
                f"{user_profile['nama']} dikenal sebagai orang yang {user_profile['karakter']}. Dia sangat detail dalam pekerjaannya dan selalu ingin memahami hal-hal baru.",
                f"Kepribadian {user_profile['nama']} bisa digambarkan sebagai {user_profile['karakter']}. Dia senang menghadapi tantangan dan selalu mencari cara untuk meningkatkan keterampilannya.",
                f"Sebagai seseorang yang {user_profile['karakter']}, {user_profile['nama']} selalu mengejar kesempurnaan dalam setiap proyeknya. Dia pun suka berbagi pengetahuan dan membantu orang lain."
            ]
            response = random.choice(pembuka) + random.choice(responses) + random.choice(penutup)
            
        elif any(word in question for word in ["rencana", "masa depan", "target", "tujuan", "cita"]):
            responses = [
                f"Untuk masa depan, {user_profile['nama']} berencana untuk {user_profile['rencana_masa_depan']}. Dia selalu melihat teknologi sebagai alat untuk membuat perubahan positif.",
                f"{user_profile['nama']} memiliki visi untuk {user_profile['rencana_masa_depan']}. Ini sejalan dengan minatnya pada teknologi dan keinginannya untuk terus berkembang.",
                f"Rencana {user_profile['nama']} ke depan adalah {user_profile['rencana_masa_depan']}. Dia percaya bahwa AI dan machine learning akan memainkan peran penting dalam menyelesaikan masalah-masalah kompleks."
            ]
            response = random.choice(pembuka) + random.choice(responses) + random.choice(penutup)
            
        else:
            quotes = random.choice(user_profile['quotes_favorit'])
            responses = [
                f"{user_profile['nama']} adalah seorang {user_profile['pekerjaan']} yang berbasis di {user_profile['lokasi']}. Dia memiliki keahlian di bidang {', '.join(user_profile['keahlian'][0:3])} dan sangat tertarik dengan perkembangan teknologi terbaru.",
                f"Sebagai seorang yang {user_profile['karakter']}, {user_profile['nama']} terus mengembangkan dirinya di bidang teknologi. Salah satu quotes favoritnya adalah '{quotes}'.",
                f"{user_profile['nama']} menggabungkan keahlian teknis dengan kreativitas dalam setiap proyeknya. Dengan pengalaman {user_profile['pengalaman']}, dia terus mencari cara untuk membuat teknologi lebih berdampak positif."
            ]
            response = random.choice(pembuka) + random.choice(responses) + random.choice(penutup)
        
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