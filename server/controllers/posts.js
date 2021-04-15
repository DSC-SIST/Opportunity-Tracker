import  mongoose  from 'mongoose';
import  Posts from '../models/posts.js'


export const getPosts = async (req, res) => {

    try {
        const posts = await Posts.find();
        
        res.status(200).json(posts);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

export const createPost = async (req, res) => {

    const post = req.body;


    const newOpportunity = new Posts(post);

    try {
        await newOpportunity.save()

        res.status(201).json(newOpportunity)
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const updatePost = async(req,res) =>{
    const {id:_id} = req.params;

    const post = req.body;

    //checking if the id is a valid moongoose id
    if(!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).json('No post with that id')
    }

    const updatedPost = await Posts.findByIdAndUpdate(_id, post, {new:true})

    res.json(updatedPost)
     
}

export const deletePost = async (req,res)=>{
    const {id} = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);


    await Posts.findByIdAndRemove(id);

    res.json({message:'Post Deleted Successfully'});
}
export const likePost = async (req,res)=>{
    const {id} = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);


    const post = await Posts.findById(id);

    const updatedPost = await Posts.findByIdAndUpdate(id,{likeCount: post.likeCount+1},{new:true});
    
    res.json(updatedPost);
};




























