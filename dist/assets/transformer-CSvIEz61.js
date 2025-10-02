const a="#000000";function e(o){const s=o.map((t,i)=>({asset:{type:"html",html:`<p>${t.title}</p>`,css:`p {
        font-family: 'Arial', sans-serif;
        font-weight: bold;
        color: #ffffff;
        font-size: 46px;
        text-align: left;
        background-color: rgba(0, 0, 0, 0.7);
        padding: 10px 20px;
        border-radius: 6px;
        margin: 0;
        display: inline-block;
      }`,width:960,height:120},start:i*4,length:4,position:"bottomLeft",offset:{x:.03,y:.135},transition:{in:"slideRight",out:"slideLeft"}})),n=o.map((t,i)=>({asset:{type:"image",src:t.url},start:i*4,length:4,transition:{in:"fade",out:"fade"},fit:"contain"}));return{timeline:{background:a,tracks:[{clips:s},{clips:n}]},output:{format:"mp4",resolution:"sd"}}}export{e as transformToShotstackPayload};
