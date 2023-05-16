import Fastify from 'fastify'
import cors from '@fastify/cors'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
    log: ['query'], // Vai dar um log no terminal de todas as querys executadas no DB, bom pra debuggar
})

async function bootstrap() {
    const fastify = Fastify({
        logger: true, // Com essa propriedade o fastify vai soltando logs de tudo que vai acontecendo na aplicação
    })

    await fastify.register(cors, {
        origin: true, // Permite qualquer aplicação a acessar o uso do back-end
    })

    // https://localhost:3333/pools/count
    fastify.get('/pools/count', async () => {
        const pools = await prisma.pool.findMany({ // Com o await, vindo da async, ele aguarda essa operação ser realizada pra aí executar o resto
            where: {
                code: {
                    startsWith: 'G'
                }
            }
        }) // Como toda operação no BD executa e demora um tempo, chamamos de promise, é algo assíncrono

        const count = await prisma.pool.count() // Conta quantos elementos tem na tabela
        
        return { pools, count }
    })
    
    await fastify.listen({port:3333, /*host: '0.0.0.0'*/ }) // o host é para que a aplicação funcione em um abiente mobile
}

bootstrap()