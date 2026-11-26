/* Harmony elixir economics. Recipe quantities are sourced from recipe-data.json.
   All costs are replacement costs; expected yield is configurable, not a game guarantee. */
(function(root){
'use strict';
const num=(x)=>typeof x==='number'&&Number.isFinite(x)&&x>=0;
const price=(r)=>r&&num(r.price)&&r.price>0?r.price:null;
const stock=(r)=>r&&num(r.inStock)?r.inStock:null;
function calculate(data,market,inventory,options={}){
 const normal=options.normal??3.5,blue=options.blue??0.5,net=options.net??0.845,target=options.target??1000;
 if(!num(normal)||!num(blue)||normal+3*blue<=0||!num(net)||net>1||!Number.isSafeInteger(target)||target<0)throw Error('Invalid yield, tax or target');
 const items=new Map(market.map(r=>[Number(r.itemId),r]));
 const inv=(id,name)=>{const v=inventory[id]??inventory[name];return num(v)?Math.floor(v):0;};
 const result=[];
 const finalOwned=inv(1399,'Harmony Draught');
 const remaining=10*Math.ceil(Math.max(0,target-finalOwned)/10);
 for(const g of Object.values(data.draughts)){
  const batches=Math.ceil(Math.max(0,remaining-inv(g.productId,g.productName))/10);
  for(const e of g.elixirs){
   const n=items.get(e.itemId),b=items.get(e.higherGrade.itemId);
   const nq=inv(e.itemId,e.name),bq=inv(e.higherGrade.itemId,e.higherGrade.name);
   const required=g.recipe.ingredients.find(i=>i.itemId===e.itemId).quantity*batches;
   const deficit=Math.max(0,required-nq-3*bq);
   const inputs=e.recipe.ingredients.map(i=>({id:i.itemId,name:i.name,qty:i.quantity,price:price(items.get(i.itemId)),stock:stock(items.get(i.itemId)),owned:inv(i.itemId,i.name)}));
   const missing=inputs.filter(i=>i.price===null);
   const perCraft=missing.length?null:inputs.reduce((s,i)=>s+i.qty*i.price,0);
   const eq=normal+3*blue, craftUnit=perCraft===null?null:perCraft/eq;
   const normalBuy=price(n),blueBuy=price(b)===null?null:price(b)/3;
   // Whole-item procurement for a single elixir; inventory already deducted.
   // Enumerate possible blue purchases, filling remaining need with normal items.
   let best=null;
   if(deficit===0)best={normal:0,blue:0,cost:0};
   else{
    const maxBlue=blueBuy===null?0:Math.min(stock(b)??0,Math.ceil(deficit/3));
    for(let j=0;j<=maxBlue;j++){
     const k=Math.max(0,deficit-3*j);
     if(k>0&&(normalBuy===null||k>(stock(n)??0)))continue;
     const cost=k*(normalBuy??0)+j*(price(b)??0);
     if(!best||cost<best.cost)best={normal:k,blue:j,cost};
    }
   }
   const crafts=Math.ceil(deficit/eq);
   const craftCost=perCraft===null?null:crafts*perCraft;
   const blocked=inputs.filter(i=>crafts*i.qty>i.owned+(i.stock??0)).map(i=>({name:i.name,needed:crafts*i.qty,owned:i.owned,stock:i.stock}));
   const scarce=inputs.filter(i=>i.stock===0).map(i=>i.name);
   let advice='Compare manually';
   if(!deficit)advice='Use inventory';
   else if(best&&(!blocked.length&&craftCost!==null?best.cost<=craftCost:true))advice='Buy';
   else if(craftCost!==null&&!blocked.length)advice='Craft (expected)';
   else if(best)advice='Buy';
   else if(blocked.length)advice='Source inputs / preorder';
   else if(missing.length)advice='Missing price';
   result.push({group:g.productName,name:e.name,id:e.itemId,blueName:e.higherGrade.name,blueId:e.higherGrade.itemId,nq,bq,required,deficit,inputs,perCraft,craftUnit,normalBuy,blueBuy,normalStock:stock(n),blueStock:stock(b),best,crafts,craftCost,scarce,blocked,advice,
    netOutput:normalBuy===null||price(b)===null?null:net*(normal*normalBuy+blue*price(b)),
    volume:n?.fourteenDayVolume??null});
  }
 }
 return result;
}
root.HarmonyEconomics={calculate};
if(typeof module!=='undefined')module.exports={calculate};
})(typeof globalThis!=='undefined'?globalThis:this);
