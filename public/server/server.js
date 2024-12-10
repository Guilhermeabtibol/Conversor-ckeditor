const express = require('express');
const multer = require('multer');
const fs = require('fs-extra');
const path = require('path');
const app = express();


//configuracao do multer para armazenar imagens
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now(0) + path.extname(file.originalname)); //usa o timestaamp para o nome do arquivo
    }
});

const upload = multer({ storage: storage });

app.use(express.static('public'));
app.use(express.json());

//rota para a pagina html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

//rota para upload 
app.post('/upload', upload.array('images'), (req, res) => {
    const { questionsText } = req.body // vai receber o texto das questoes
    const images = req.files; // as imagens ja carregadas


    //funcao para redimensionar e gerar o xml 
    generateXML(questionsText, images)
        .then(xml => {
            fs.writeFileSync('public/uploads/quiz.xtml', xml); //vai salvar o xml gerado na pasta de uploads
            res.json({ sucess: true, message: 'Arquivo gerado com sucesso', fileUrl: '/uploads/quiz.xml' });
        })
        .catch(error => {
            res.status(500).json({ sucess: false, message: 'Erro ao gerar XML', error});
        });
});

