import Dev from '../models/Dev';
import api from '../services/api';

class DevController {
    
    async index(req, res) {
        const { user } = req.headers;

        const loggeDev = await Dev.findById(user);

        const devs = await Dev.find({
            $and: [
                { _id: { $ne: user }},
                { _id: { $nin: loggeDev.likes }},
                { _id: { $nin: loggeDev.dislikes }}
            ],
        });
        
        res.json(devs);
    }

    async store(req, res) {

        const { username } = req.body;

        const userExist = await Dev.findOne({ user: username });

        if(userExist){
            return res.json(userExist);
        }

        const response = await api.get(`/${username}`);
        
        const { name, bio, avatar_url:avatar } = response.data;

        const dev = await Dev.create({
            name,
            user: username,
            bio,
            avatar,
        });
        
        return res.json(dev);
    }
}

export default new DevController();