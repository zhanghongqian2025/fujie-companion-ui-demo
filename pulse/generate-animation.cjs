/* Original procedural Lottie vector animation; no third-party design assets. */
const fs=require('node:fs'); const path=require('node:path');
const prop=k=>({a:0,k});
const ease={i:{x:[.65],y:[1]},o:{x:[.35],y:[0]}};
function keys(values){return {a:1,k:values.map(([t,s],i)=>i===values.length-1?{t,s}:{t,s,e:values[i+1][1],...ease})};}
const transform=(position,scale=prop([100,100,100]),rotation=prop(0),opacity=prop(100))=>({o:opacity,r:rotation,p:position,a:prop([0,0,0]),s:scale});
const fill=(color)=>({ty:'fl',c:prop(color),o:prop(100),r:1,bm:0});
const stroke=(color,width)=>({ty:'st',c:prop(color),o:prop(100),w:prop(width),lc:2,lj:2,ml:4,bm:0});
const base=(ind,nm,ks,shapes)=>({ddd:0,ind,ty:4,nm,sr:1,ks,ao:0,shapes,ip:0,op:90,st:0,bm:0});
const layers=[];
layers.push(base(1,'checkmark',transform(prop([160,160,0]),keys([[0,[0,0,100]],[18,[0,0,100]],[34,[110,110,100]],[45,[100,100,100]],[89,[100,100,100]]])),[
  {ty:'sh',ks:prop({i:[[0,0],[0,0],[0,0]],o:[[0,0],[0,0],[0,0]],v:[[-18,-1],[-5,12],[23,-17]],c:false})},stroke([.96,.98,.92],8)
]));
layers.push(base(2,'medal',transform(prop([160,160,0]),keys([[0,[0,0,100]],[10,[0,0,100]],[25,[116,116,100]],[38,[100,100,100]],[89,[100,100,100]]])),[
  {ty:'el',p:prop([0,0]),s:prop([108,108])},fill([.27,.43,.29]),stroke([.79,.88,.66],7)
]));
for(let n=0;n<12;n++){
  const a=n*Math.PI/6,dx=Math.sin(a),dy=-Math.cos(a);
  layers.push(base(n+3,`particle-${n+1}`,transform(keys([[0,[160,160,0]],[16,[160+dx*45,160+dy*45,0]],[42,[160+dx*112,160+dy*112,0]],[70,[160+dx*120,160+dy*120,0]],[89,[160+dx*120,160+dy*120,0]]]),prop([100,100,100]),prop(n*30),keys([[0,[0]],[16,[0]],[25,[100]],[45,[100]],[70,[0]],[89,[0]]])),[
    {ty:'rc',p:prop([0,0]),s:prop([n%2?5:7,n%2?13:7]),r:prop(3)},fill(n%3===0?[.93,.68,.47]:[.6,.75,.49])
  ]));
}
const animation={v:'5.13.0',fr:30,ip:0,op:90,w:320,h:320,nm:'Pulse completion - original Fujie concept',ddd:0,assets:[],layers,markers:[]};
fs.writeFileSync(path.join(__dirname,'completion.json'),JSON.stringify(animation));
console.log(`Generated original Lottie: ${layers.length} vector layers, 90 frames / 30 fps`);
