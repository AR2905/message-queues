import express from 'express'

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
    return res.status(200).send('All Set')
})

app.listen(8000, () => {
    console.log('Running on 8000...')
})