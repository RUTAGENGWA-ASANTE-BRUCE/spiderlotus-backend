import mongoose from 'mongoose';

const connectionParams={
    useNewUrlParser:true,
    useUnifiedTopology:true,
    autoIndex:true,
}
const database="sl_shop"
const password="bruce2005"
const uri=`mongodb+srv://Bruce:${password}@cluster0.goutq8i.mongodb.net/${database}?retryWrites=true&w=majority`

const connectMongo=async ()=>mongoose.connect(uri,connectionParams).then(()=>console.log('connected to cloud atlas')).catch(err=>console.log(err))

export default connectMongo;