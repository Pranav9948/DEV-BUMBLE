const express=require('express')
const PORT=5000

const app=express()

app.get('/',(req,res)=>{

    res.status(500).send('welcome to nodejs')
})

app.listen(PORT,()=>{

    console.log(`app running on port ${PORT} `)
})