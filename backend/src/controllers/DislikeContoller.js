import Dev from '../models/Dev';

class DislikeController {
    async store(req, res){

        const { user } = req.headers;
        const { devId } = req.params;
        
        const loggedDev = await Dev.findById(user);
        const targgetDev = await Dev.findById(devId);

        if(!targgetDev) {
            return res.status(400).json('Dev not exist');
        }

        loggedDev.dislikes.push(targgetDev._id);

        loggedDev.save();

        res.json(loggedDev);
    }
}

export default new DislikeController();