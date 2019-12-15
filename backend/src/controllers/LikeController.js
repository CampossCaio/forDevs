import Dev from '../models/Dev';

class LikeController {
    async store(req, res) {

        console.log(req.io, req.connectedUsers);

        const { user } = req.headers;
        const { devId } = req.params;
        
        const loggedDev = await Dev.findById(user);
        const targgetDev = await Dev.findById(devId);

        if(!targgetDev){
            return res.status(400).json({ error: 'Dev not exist'});
        }

        loggedDev.likes.push(targgetDev._id);

        if(targgetDev.likes.includes(user)){
            
            const loggedSocket = req.connectedUsers[user];
            const targgetSocket = req.connectedUsers[devId];
            
            // Informando ao usuário logado que ele deu match no usuário alvo
            if(loggedSocket) {
                req.io.to(loggedSocket).emit('match', targgetDev);
            }
            
            // Informando ao usuário alvo que ele deu match no usuário logado
            if(targgetSocket) {
                req.io.to(targgetSocket).emit('match', loggedDev);
            }

            console.log('DEU MATCH!');
        }

        await loggedDev.save();

        return res.json(loggedDev);
    }
}

export default new LikeController();