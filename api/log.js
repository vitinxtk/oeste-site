const fs = require('fs');
const path = require('path');

// Caminho para o arquivo de log onde os dados serão salvos
const logFilePath = path.join(process.cwd(), 'visitors.log');

module.exports = (req, res) => {
    // Apenas processa requisições do tipo POST
    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                // Converte os dados para uma linha de texto e adiciona a quebra de linha
                const logEntry = JSON.stringify(data) + '\n';
                
                // Adiciona a nova linha no final do arquivo de log
                fs.appendFile(logFilePath, logEntry, (err) => {
                    if (err) {
                        console.error('Erro ao escrever no arquivo de log:', err);
                        res.status(500).send('Erro interno do servidor.');
                    } else {
                        console.log('Dados recebidos e salvos.');
                        res.status(200).send('Dados recebidos com sucesso!');
                    }
                });
            } catch (error) {
                res.status(400).send('Requisição inválida. O corpo da requisição precisa ser um JSON válido.');
            }
        });
    } else {
        // Retorna um erro se a requisição não for POST
        res.status(405).send('Método não permitido.');
    }
};
