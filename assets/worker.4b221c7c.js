(function(){"use strict";const R=[{x:1,y:0,w:.4375},{x:-1,y:1,w:.1875},{x:0,y:1,w:.3125},{x:1,y:1,w:.0625}],_=[{x:1,y:0,w:7/48},{x:2,y:0,w:5/48},{x:-2,y:1,w:3/48},{x:-1,y:1,w:5/48},{x:0,y:1,w:7/48},{x:1,y:1,w:5/48},{x:2,y:1,w:3/48},{x:-2,y:2,w:1/48},{x:-1,y:2,w:3/48},{x:0,y:2,w:5/48},{x:1,y:2,w:3/48},{x:2,y:2,w:1/48}],S=[{x:1,y:0,w:5/32},{x:2,y:0,w:3/32},{x:-2,y:1,w:2/32},{x:-1,y:1,w:4/32},{x:0,y:1,w:5/32},{x:1,y:1,w:4/32},{x:2,y:1,w:2/32},{x:-1,y:2,w:2/32},{x:0,y:2,w:3/32},{x:1,y:2,w:2/32}],B=[{x:1,y:0,w:1/2},{x:0,y:1,w:1/2}],L=[{x:1,y:0,w:8/42},{x:2,y:0,w:4/42},{x:-2,y:1,w:2/42},{x:-1,y:1,w:4/42},{x:0,y:1,w:8/42},{x:1,y:1,w:4/42},{x:2,y:1,w:2/42},{x:-2,y:2,w:1/42},{x:-1,y:2,w:2/42},{x:0,y:2,w:4/42},{x:1,y:2,w:2/42},{x:2,y:2,w:1/42}],V=[R,_,L,S,B];function j(t){return t[0]*.299+t[1]*.587+t[2]*.114}function N(t,r=2.2){return t.map(o=>{let e=o/255;return e=e>.04045?Math.pow((e+.055)/1.055,r):e/12.92,e*100})}function U(t,r=2.2){return t.map(o=>{let e=o/100;return e=e>.0031308?1.055*Math.pow(e,1/r)-.055:e*12.92,~~(e*255)})}var m=(t=>(t.Indexed="Indexed",t.Mono="Monochrome",t.RGB="RGB",t.Mixer="Mixer",t.Auto="Auto",t))(m||{});const q=(t,r)=>{const e=t.data.slice(0,4)[1]===1,u=(t.data.length-4)/5,s=e?[255,255,255]:[0,0,0],i=n=>t.data[4+n*5],x=n=>t.data[5+n*5],p=n=>t.data.slice(6+n*5,9+n*5),a=n=>{let l=r;for(let h=0;h<n;h++)l=~~(l/i(h));return l%i(n)};for(let n=0;n<u;n++)p(n).forEach((l,h)=>{e&&(l=255-l);const y=~~(l*x(n)),d=l-y,g=y+a(n)*~~(d/(i(n)-1));s[h]+=e?-g:g,s[h]<0&&(s[h]=0),s[h]>255&&(s[h]=255)});return s},C=t=>{switch(t.type){case m.Indexed:return t.data.length/3;case m.Mono:return t.data[0];case m.RGB:return t.data[0]*t.data[1]*t.data[2];case m.Mixer:{const r=(t.data.length-4)/5;let o=1;for(let e=0;e<r;e++)o*=t.data[4+e*5];return o}case m.Auto:return t.data[0];default:return 0}},F=(t,r)=>{if(r<0||r>=C(t))throw new Error(`Color index ${r} out of bounds`);switch(t.type){case m.Indexed:return t.data.slice(r*3,r*3+3);case m.Mono:return t.data.slice(2,5).map(o=>{const e=~~(o*t.data[1]),u=o-e;return e+r*~~(u/(t.data[0]-1))});case m.Mixer:return q(t,r);case m.RGB:{const o=r%t.data[2],e=~~(r/t.data[2])%t.data[1];return[~~(r/(t.data[2]*t.data[1])),e,o].map((s,i)=>s*~~(255/(t.data[i]-1)))}case m.Auto:default:throw new Error("Invalid or Auto palette type")}},G=t=>Array.from({length:C(t)},(r,o)=>F(t,o));function O(t,r,o){let e=[],u=Number.POSITIVE_INFINITY;for(let s=0;s<r.length;s++){const i=o(t,r[s]);i<=u&&(e=r[s],u=i)}return e}const W=(t,r)=>(t[0]-r[0])*(t[0]-r[0])+(t[1]-r[1])*(t[1]-r[1])+(t[2]-r[2])*(t[2]-r[2]);function X(t,r,o,e){const u=t.width*t.height*4,s=t.width*4,i=V[o.matrix||0];if(!r.palette.palette)throw new Error("null palette");const x=G(r.palette.palette),p=o.gamma||2.2;for(let a=0;a<u;a+=4){const n=N(Array.from(t.data.slice(a,a+3)),p);for(let l=0;l<3;l++)t.data[a+l]=n[l];a%(s*4)===0&&e&&e(a,u,t)}for(let a=0;a<x.length;a++)x[a]=N(x[a],p);for(let a=0;a<u;a+=4){const n=Array.from(t.data.slice(a,a+3)),l=O(n,x,W),h=a%s/4;for(let d=0;d<3;d++)t.data[a+d]=U(l,p)[d];const y=n.map((d,g)=>(d-l[g])*(o.error_mult||1));for(let d=0;d<i.length;d++){const g=a+i[d].x*4+i[d].y*s;if(h+i[d].x>=0&&h+i[d].x<t.width)for(let c=0;c<3;c++)t.data[g+c]+=y[c]*i[d].w}a%(4*s)===0&&e&&e(a,u,t)}return t}const Y={id:"ProcErrorDiffusion",name:"Error Diffusion",run:X,maxAllowedPaletteSize:65536,supports:{threads:!1,gamma:!0},complexity:t=>t*2},H=Array.from({length:100001});function J(t){for(let r=0;r<=1e5;r++)H[r]=Math.pow(r/1e5,1/t)*255}function P(t,r=2.2){const o=[0,0,0];for(let e=0;e<3;e++)o[e]=Math.pow(t[e]/255,r);return o}const K=[0,12,3,15,8,4,11,7,2,14,1,13,10,6,9,5].map(t=>t*16);var Q={size:4,data:K};const Z=[0,48,12,60,3,51,15,63,32,16,44,28,35,19,47,31,8,56,4,52,11,59,7,55,40,24,36,20,43,27,39,23,2,50,14,62,1,49,13,61,34,18,46,30,33,17,45,29,10,58,6,54,9,57,5,53,42,26,38,22,41,25,37,21].map(t=>t*4);var b={size:8,data:Z},I={size:16,data:[111,49,141,161,113,194,71,176,200,50,150,94,66,37,85,251,25,99,238,221,32,249,147,19,38,106,219,169,193,137,13,166,125,177,79,15,65,172,123,87,212,130,246,23,116,54,228,211,41,201,151,131,188,104,53,235,160,62,1,180,77,240,146,68,2,243,56,91,229,5,203,28,186,101,143,205,33,92,189,107,222,163,114,36,213,155,138,70,244,84,225,48,126,157,17,134,83,195,21,253,76,45,178,115,12,40,168,105,252,175,210,59,100,179,144,122,171,97,234,128,214,148,198,8,72,26,237,44,231,31,69,11,204,58,18,192,88,60,112,220,139,86,120,152,207,129,242,159,223,110,34,247,164,24,233,183,52,197,170,6,108,187,51,89,136,185,153,78,47,133,98,156,35,248,95,63,16,75,218,39,0,67,227,121,196,239,3,74,127,20,226,142,245,174,119,199,250,103,145,14,208,173,109,217,191,82,202,162,29,93,149,22,165,181,55,30,90,64,42,140,167,57,117,46,215,232,61,128,81,236,216,118,158,254,184,27,241,102,4,132,73,190,9,209,43,96,7,135,230,80,10,124,224,206,154,182]},t1={size:64,data:[65,246,203,177,54,148,96,135,122,62,109,205,27,217,151,103,250,78,122,228,3,83,232,160,45,241,109,40,125,93,201,36,230,187,254,206,147,14,87,134,245,197,177,223,59,92,132,169,49,182,140,3,58,164,27,204,12,83,196,5,159,183,92,196,170,140,24,127,109,255,36,210,79,192,178,141,168,11,70,130,181,27,147,47,191,170,67,14,187,76,0,197,161,66,146,172,104,134,58,97,182,231,162,115,34,74,2,237,162,187,7,242,217,31,69,193,243,87,146,130,248,172,224,104,235,21,217,117,236,49,87,154,228,69,15,166,235,25,48,86,119,238,195,91,7,221,165,105,21,255,120,146,210,129,88,236,22,52,244,18,74,157,25,8,126,43,64,189,218,95,128,24,207,46,113,145,85,102,228,119,41,106,222,66,50,152,32,126,47,144,57,10,191,104,213,4,43,196,181,104,146,1,223,252,60,34,161,45,244,61,208,133,89,199,37,56,245,29,174,151,114,189,211,127,179,238,215,194,246,109,26,240,170,52,155,108,81,249,28,195,60,175,153,19,208,176,16,186,114,210,93,72,178,203,82,162,28,72,179,241,160,83,120,55,213,128,155,100,180,136,213,106,144,117,31,230,71,154,177,106,94,224,47,69,229,99,83,4,46,114,87,141,72,156,202,80,139,13,232,181,137,67,159,212,10,130,253,77,52,160,234,80,6,241,192,19,253,111,227,131,247,147,115,60,133,207,26,248,91,68,31,202,13,78,229,16,201,82,183,52,240,18,220,8,139,163,202,13,134,32,164,223,198,63,33,169,51,223,101,20,116,211,61,198,36,226,121,93,236,38,200,97,141,123,33,102,139,165,58,133,157,4,96,41,198,13,219,98,17,226,144,40,189,172,236,113,53,189,126,67,173,156,4,101,141,114,204,63,191,79,118,240,185,57,143,247,103,154,229,121,1,178,39,149,186,253,89,4,101,172,17,185,55,112,167,0,215,246,63,203,227,43,86,219,34,206,65,172,80,51,186,37,171,73,110,161,10,219,81,140,163,241,26,95,252,39,215,193,170,44,85,125,249,22,40,149,108,207,76,21,130,13,183,252,94,209,240,129,68,45,165,127,242,48,152,82,142,222,71,29,179,86,189,150,24,176,122,104,184,141,238,120,225,135,89,253,125,193,242,61,97,123,45,5,212,104,148,50,223,135,120,75,247,29,228,158,53,176,213,88,5,168,43,191,90,213,74,29,135,59,84,9,225,110,27,145,215,70,204,250,22,194,155,242,133,46,8,115,73,249,15,233,77,48,23,154,106,165,205,2,152,49,25,206,232,150,183,251,66,35,203,185,20,86,57,11,150,96,186,3,137,234,102,64,254,221,119,231,173,54,148,201,162,115,195,173,153,203,234,79,188,114,6,131,105,43,91,118,59,226,162,95,213,136,55,193,163,94,211,10,240,28,64,232,104,84,177,137,74,18,198,89,131,171,77,113,160,235,199,225,128,66,209,108,75,35,155,196,132,29,157,67,112,36,239,105,19,46,220,33,93,53,11,178,58,34,226,169,64,182,235,206,19,107,198,236,39,157,204,1,127,251,177,72,191,122,42,143,198,13,218,119,35,108,54,159,23,240,219,0,143,100,177,37,166,243,16,173,224,123,20,183,50,82,16,244,141,3,217,81,185,249,142,73,107,245,124,137,99,156,239,87,201,11,135,35,170,143,69,181,28,88,110,67,147,30,115,54,150,174,221,76,163,240,58,156,248,173,226,213,99,120,60,43,246,67,17,110,52,144,89,199,57,245,94,208,146,105,178,205,94,190,128,65,170,8,122,229,22,193,162,218,16,195,46,123,30,158,73,216,84,254,13,53,130,244,173,230,43,220,201,86,244,23,94,131,33,114,95,190,3,84,140,40,10,146,178,194,130,210,80,190,218,25,119,42,139,163,11,70,238,219,124,57,162,44,228,152,97,57,209,156,180,66,42,86,253,71,143,103,224,248,113,178,44,124,223,104,150,215,23,81,184,101,137,6,111,210,52,229,179,17,212,45,131,235,63,187,206,81,231,93,29,163,121,253,152,71,237,187,80,215,116,43,168,6,34,77,252,12,113,30,238,198,39,83,131,3,232,112,27,167,214,2,187,54,96,148,5,196,161,75,189,7,119,58,159,18,234,68,185,158,11,193,65,246,144,72,204,27,122,105,255,157,52,12,223,141,40,6,92,207,172,2,31,102,251,142,191,91,234,197,135,182,87,211,138,16,116,247,98,212,146,201,182,59,130,82,153,17,207,241,63,91,237,32,205,96,144,250,198,126,169,40,254,98,139,121,86,169,107,160,93,182,168,15,70,33,117,173,106,62,233,183,55,132,107,158,230,198,59,24,128,64,111,151,21,221,53,166,75,177,190,62,30,172,52,121,92,237,38,245,171,69,34,128,183,24,117,49,168,67,221,34,88,51,214,78,29,57,206,232,41,22,221,8,249,54,227,152,197,132,215,245,76,204,169,101,22,243,45,66,124,88,180,225,157,211,175,47,102,68,127,245,106,47,226,158,136,241,77,10,155,19,105,197,118,225,142,105,229,153,215,138,245,17,130,176,229,3,116,148,129,172,7,75,152,199,60,117,35,138,80,43,241,87,20,185,149,9,128,81,220,193,140,212,16,148,50,8,81,32,248,0,231,204,155,27,5,147,88,12,109,219,41,185,228,207,138,49,21,190,85,167,14,56,80,101,187,43,111,74,156,103,240,195,90,225,111,243,178,127,237,189,210,100,218,3,112,165,56,98,35,48,249,156,114,34,177,79,249,166,110,240,99,199,123,143,88,171,39,194,216,125,254,203,25,194,96,128,61,164,78,234,97,60,212,42,243,200,175,0,230,150,209,192,25,62,180,16,69,35,144,50,99,28,88,71,151,173,125,66,181,140,200,232,119,213,191,18,69,235,7,98,200,39,218,184,138,55,73,186,16,115,79,236,99,66,181,80,57,166,148,251,31,114,7,176,149,253,9,133,71,114,32,126,64,88,12,246,142,220,45,207,249,158,188,216,15,137,164,48,10,23,193,235,31,222,15,70,163,142,60,91,168,146,121,57,133,20,65,119,13,229,160,212,241,58,137,177,51,160,33,134,239,118,1,71,216,90,189,220,33,121,161,184,94,225,157,252,203,166,53,98,122,82,164,134,118,1,83,63,202,252,184,227,109,246,91,145,49,103,128,84,242,2,108,227,200,45,215,187,238,154,91,207,174,44,26,95,36,153,223,7,119,209,16,222,92,175,50,197,139,242,45,131,70,106,204,23,144,194,47,106,22,136,216,36,173,231,28,95,236,175,224,125,103,39,76,214,132,58,201,78,159,252,208,29,175,188,37,132,254,27,85,107,164,30,246,76,147,107,252,132,201,109,23,249,88,192,149,107,40,231,211,23,106,154,18,166,237,51,82,245,62,6,86,178,77,239,112,184,68,10,193,55,108,43,23,167,148,9,118,153,27,168,38,121,178,6,62,154,96,223,54,76,153,176,4,71,222,51,128,190,3,217,81,168,65,184,75,166,46,232,72,186,12,158,77,124,180,63,84,193,2,214,175,36,218,130,236,149,41,191,4,131,248,153,205,143,213,73,197,243,85,229,179,65,96,209,239,19,218,112,194,43,135,117,207,12,101,124,233,141,201,15,101,231,60,117,195,48,12,125,206,101,139,25,127,245,54,141,98,247,35,227,208,96,118,137,152,100,114,165,207,15,223,60,161,90,47,104,79,18,254,156,135,57,32,204,48,248,2,187,136,70,90,143,232,79,247,21,164,243,183,59,194,35,114,172,151,41,180,24,156,235,223,146,243,36,220,62,174,86,115,206,191,5,169,52,142,250,29,64,232,10,190,49,69,122,102,142,200,235,30,225,126,179,93,5,120,97,187,111,137,162,78,104,225,46,165,30,183,10,202,66,145,83,217,44,159,93,251,65,207,85,242,140,99,31,89,57,1,160,113,198,7,214,163,20,66,221,129,112,12,160,180,44,198,76,255,92,27,174,245,83,19,116,168,187,61,37,165,50,222,173,12,218,21,233,125,151,14,198,251,57,102,125,170,49,110,32,134,17,237,78,8,132,226,20,124,72,205,171,115,191,80,180,93,251,151,37,236,47,94,148,79,237,201,71,90,220,126,19,157,136,230,186,37,210,54,71,216,9,147,230,69,193,240,76,147,60,90,192,37,55,177,114,131,214,157,224,92,238,195,228,98,205,119,177,215,49,96,165,196,6,255,44,135,239,216,23,131,50,103,77,123,178,254,26,187,40,103,21,242,147,105,171,209,59,111,11,162,124,150,251,134,99,206,112,141,17,33,206,127,251,169,72,212,244,92,26,82,4,71,39,19,150,180,1,167,70,143,24,155,188,35,145,55,109,219,65,19,152,39,70,233,189,15,227,136,195,109,160,215,60,170,132,188,54,34,82,226,40,145,74,195,94,1,178,42,84,26,246,125,89,107,157,45,100,29,121,5,158,203,234,145,188,244,208,116,79,61,129,47,248,192,58,105,246,116,234,177,82,158,185,98,202,122,173,145,61,166,204,28,55,1,85,121,140,230,209,4,118,249,200,8,98,246,214,50,234,220,108,199,158,56,174,41,212,234,177,8,199,227,184,106,134,65,45,167,108,55,175,140,254,23,220,90,113,36,230,83,3,70,200,16,32,126,230,9,84,250,107,11,213,115,90,156,72,222,242,15,32,76,46,87,158,176,68,133,190,168,116,21,132,34,64,240,14,225,188,2,148,61,82,136,239,53,149,83,220,17,99,225,31,126,8,192,100,160,203,185,16,148,209,127,172,218,136,93,241,143,53,214,164,48,196,32,79,247,41,235,144,102,173,205,183,152,100,238,215,18,108,151,28,86,61,181,154,78,170,143,116,95,75,166,220,192,21,115,68,165,13,40,253,176,196,76,154,237,87,44,230,30,136,77,239,164,95,48,22,156,61,44,205,181,71,118,26,140,94,224,179,132,7,184,200,126,48,65,248,112,195,26,127,56,233,42,219,239,6,207,250,91,189,28,211,134,253,103,121,48,248,181,96,217,129,191,59,117,138,22,202,60,169,216,68,109,53,122,5,64,195,226,183,102,249,113,167,6,103,243,191,64,236,150,55,162,97,67,20,34,163,90,134,7,168,69,142,182,201,78,124,162,142,104,39,123,12,233,49,66,33,144,14,90,160,36,205,24,109,232,92,159,1,244,111,94,130,16,183,153,246,176,221,141,31,74,133,11,211,29,147,81,222,39,174,124,2,111,21,209,121,221,253,110,214,18,229,53,219,38,253,93,1,171,100,50,71,192,222,57,202,109,162,182,198,237,209,226,64,140,243,153,74,171,33,212,49,179,219,38,250,144,205,9,84,210,44,106,253,118,233,86,191,68,235,197,133,15,156,86,217,75,245,194,44,84,170,142,188,77,150,117,202,81,159,120,31,211,247,14,232,26,134,168,147,74,244,9,83,53,27,170,126,4,84,51,201,9,241,131,85,69,149,25,191,77,117,35,163,96,20,150,180,56,167,41,155,122,48,95,59,253,203,46,185,167,35,137,154,10,56,234,99,40,246,178,102,14,189,228,60,135,185,154,113,177,83,6,227,41,93,154,130,180,73,98,195,111,230,184,123,63,146,106,188,231,123,165,54,103,223,63,241,129,198,79,8,203,25,138,221,0,181,164,24,114,100,144,233,61,106,91,226,181,72,131,2,210,60,22,137,239,47,107,148,75,39,89,208,62,254,99,120,214,20,205,114,37,222,147,254,44,19,166,97,222,21,207,41,10,97,210,14,235,171,140,189,52,229,159,216,92,110,238,73,103,247,214,140,229,72,9,28,130,206,14,249,112,198,31,161,121,194,92,156,68,215,10,200,236,20,224,127,46,198,32,186,136,173,63,247,160,190,12,58,134,217,150,34,248,80,174,157,253,65,195,130,43,88,27,1,109,69,30,123,246,61,172,196,131,20,64,35,188,170,215,155,241,79,172,26,51,150,222,242,80,171,226,34,129,164,88,175,123,101,168,3,141,160,238,70,50,234,105,1,92,120,79,174,199,89,70,118,190,136,56,115,30,141,81,244,155,184,120,209,251,176,143,46,185,149,16,38,89,158,205,82,125,45,89,117,54,193,146,124,212,87,103,44,141,17,52,252,112,187,28,248,42,67,194,243,80,108,14,151,87,29,196,139,46,211,231,25,106,244,13,49,232,5,94,200,221,181,4,107,217,72,232,149,39,85,102,227,5,81,211,228,53,179,112,237,18,197,250,178,3,98,40,237,63,167,7,185,69,208,100,199,3,78,222,55,139,155,216,31,58,176,205,217,126,164,225,68,19,243,155,128,38,208,182,154,212,168,74,238,45,122,163,55,34,17,97,59,165,192,23,204,134,164,106,121,143,244,4,153,99,139,67,32,224,204,73,187,138,24,248,110,228,130,152,174,63,144,119,204,8,111,183,92,121,230,23,98,6,252,111,182,145,99,52,72,167,139,61,101,128,28,110,149,20,89,229,193,145,175,203,129,11,218,116,237,54,68,254,28,190,74,40,217,56,228,163,113,133,159,107,11,219,120,201,155,36,13,87,231,43,242,160,90,234,74,25,251,149,41,135,192,78,56,38,204,171,7,194,223,113,2,227,80,42,250,186,59,172,209,69,132,247,80,110,239,47,75,157,91,37,199,175,12,221,94,169,129,184,12,78,240,19,56,253,174,91,50,77,177,58,243,122,24,192,102,35,18,188,171,132,51,200,166,64,243,179,156,130,82,29,117,251,88,178,23,241,161,199,11,219,135,241,7,103,42,26,219,3,183,138,249,174,15,127,148,100,47,137,62,208,24,105,201,46,175,211,85,37,147,230,26,132,96,217,187,72,211,135,167,217,125,64,210,98,15,224,85,105,33,119,11,238,216,231,134,59,34,144,205,95,120,67,145,83,99,35,156,202,117,167,63,155,93,31,65,107,213,186,241,82,231,159,119,251,85,233,145,124,96,152,195,116,66,207,161,237,3,142,163,46,110,9,78,53,250,146,39,240,160,116,4,210,228,140,196,95,66,43,184,161,214,77,50,190,32,233,180,49,125,189,77,255,141,88,235,210,122,199,150,224,25,57,1,206,111,27,196,6,152,37,68,220,1,29,242,138,9,186,42,107,197,30,89,255,151,179,229,94,197,5,108,76,185,58,145,172,73,23,51,164,107,147,200,9,101,245,127,154,10,109,166,22,216,231,14,56,181,19,190,51,14,230,42,83,120,142,70,169,38,182,77,54,176,114,192,248,59,182,75,224,100,126,83,247,55,118,224,18,62,202,32,118,157,176,221,138,30,195,253,43,91,184,247,207,15,125,71,237,115,21,174,60,220,252,89,199,66,112,173,128,223,36,111,78,134,176,102,189,163,252,95,219,127,245,139,214,236,92,17,166,132,108,157,50,17,216,169,151,73,175,206,129,101,239,137,68,22,84,48,235,95,123,17,216,132,153,114,81,224,27,93,151,45,224,194,138,75,39,129,157,5,144,44,95,72,239,146,165,250,62,6,236,32,201,48,153,9,62,99,14,161,128,48,81,213,36,232,176,200,63,25,228,7,137,37,82,169,0,45,185,247,211,128,10,202,68,165,104,231,2,62,38,179,255,56,209,168,86,3,101,211,182,55,234,102,245,214,194,158,0,202,96,28,212,154,74,133,17,108,188,87,226,197,110,32,203,228,148,190,8,92,115,252,145,97,193,109,184,245,51,218,192,148,227,104,164,62,151,175,244,50,79,31,189,239,139,161,7,192,129,33,67,248,122,15,148,26,206,79,33,169,21,120,64,218,45,126,193,113,90,222,177,67,234,28,173,149,51,254,72,20,102,244,65,139,27,80,38,131,47,238,15,93,159,112,74,123,90,33,16,115,226,37,110,143,208,158,121,87,213,104,227,112,176,233,142,162,197,229,91,172,117,188,133,51,87,249,139,174,84,240,11,53,170,38,246,143,117,206,41,123,84,167,138,182,120,42,170,197,156,236,209,162,70,213,146,60,229,25,12,210,56,179,206,75,191,88,6,182,224,58,12,199,46,73,149,82,18,97,50,28,111,59,41,246,69,11,220,150,107,199,13,35,106,181,226,147,207,124,2,54,161,76,13,236,189,222,2,58,208,86,224,126,52,2,181,117,21,85,172,124,201,136,252,167,233,131,146,250,47,136,236,20,128,94,250,171,133,26,203,55,218,188,240,75,180,221,158,140,97,239,62,180,227,75,233,155,59,134,73,20,101,186,85,212,97,249,136,63,25,96,113,241,152,30,14,248,94,67,104,225,195,249,33,103,44,187,66,100,42,4,85,23,160,100,197,73,168,40,113,66,183,235,164,116,0,126,151,208,19,85,123,4,194,162,18,125,42,24,186,118,208,252,31,162,238,65,230,22,194,179,108,214,159,202,38,175,133,73,185,111,217,167,18,138,56,153,4,223,78,161,30,149,199,119,184,221,62,212,119,30,244,145,218,17,100,36,138,252,69,171,40,103,135,251,33,214,49,112,204,93,144,166,97,48,6,192,92,116,46,140,155,37,129,49,5,146,74,127,52,90,231,211,161,44,147,200,231,41,91,129,179,205,243,116,89,219,242,71,105,238,36,176,153,53,204,78,191,157,242,87,215,24,192,90,227,13,202,170,70,182,235,81,31,254,213,65,242,220,141,77,171,218,197,8,105,171,225,89,240,34,228,180,247,21,105,5,61,84,130,32,76,186,238,110,68,51,139,24,174,9,135,53,169,13,133,88,1,228,105,131,8,51,124,61,179,108,48,144,243,64,115,52,145,101,129,154,57,174,2,84,128,159,109,16,57,244,127,80,251,202,70,118,165,190,102,15,67,165,196,142,242,190,11,251,120,158,9,216,166,14,98,234,61,188,38,208,151,196,113,254,67,186,24,91,173,226,200,13,233,159,210,122,30,163,86,196,219,22,10,225,188,136,115,196,19,36,237,183,152,40,27,180,59,16,150,25,56,80,137,209,153,221,124,38,113,225,100,175,63,208,83,29,254,193,152,203,123,81,250,95,22,76,47,217,143,163,240,210,42,110,151,79,39,98,8,76,222,186,5,239,42,161,247,74,95,41,232,52,169,203,64,96,213,135,112,208,97,138,223,178,216,250,7,116,49,86,26,75,170,54,212,22,149,47,104,142,119,37,73,227,18,108,159,215,125,233,181,99,38,118,58,137,71,250,29,133]};const r1=[3,1,6,4,2,0,7,5,6,4,3,1,7,5,2,0].map(t=>t*32);var e1={size:4,data:r1};const o1=[13,12,9,7,1,2,0,0,15,17,11,6,0,3,0,0,14,16,10,8,5,4,0,0,7,1,2,13,12,9,0,0,6,0,3,15,17,11,0,0,8,5,4,14,16,10,0,0].map(t=>t*14);var n1={size:6,data:o1};const s1=[12,6,7,13,16,20,21,17,5,0,2,8,27,30,28,22,4,1,3,9,26,31,29,23,15,11,10,14,19,25,24,18,16,20,21,17,12,6,7,13,27,30,28,22,5,0,2,8,26,31,29,23,4,1,3,9,19,25,24,18,15,11,10,14].map(t=>t*8);var a1={size:8,data:s1};const c1=[b,Q,t1,I,a1,n1,e1],i1=(t,r)=>(t[0]-r[0])*(t[0]-r[0])+(t[1]-r[1])*(t[1]-r[1])+(t[2]-r[2])*(t[2]-r[2]),l1=t=>[0,.01,.02,.05,.1,.2,.35,.5,.8,1][t];function d1(t,r,o,e){if(!r.palette.palette)throw new Error("runPatternDither: No palette selected");const u=G(r.palette.palette),s=t.width*t.height*4,i=t.width*4,x=c1[o.threshold||0],p=o.gamma||2.2,a=l1(o.amount||5),n=Array(o.clist_size||64).fill(-1),l=[0,0,0];let h;const y=u.map(c=>P(c,p)),d=y.map(j),g=Array(t.data.length).fill(0);for(let c=0;c<s;c+=4){const z=P(Array.from(t.data.slice(c,c+3)),p);for(let M=0;M<3;M++)g[c+M]=z[M];c%(i*24)===0&&e&&e(c,s,t)}for(let c=0;c<s;c+=4){h=Array.from(g.slice(c,c+4));const z=c%i/4,M=~~(c/i),E=x.size,h1=4*Math.ceil(E/4),m1=x.data[z%E+h1*(M%E)]/255,$=[0,0,0];n.fill(-1);for(let w=0;w<n.length;w++){for(let f=0;f<3;f++)l[f]=h[f]+$[f]*a;let v=0,T=Number.MAX_VALUE;for(let f=0;f<y.length;f++){const k=i1(l,y[f]);k<T&&(T=k,v=f)}n[w]=v;for(let f=0;f<3;f++)$[f]=$[f]+h[f]-y[v][f]}n.sort((w,v)=>d[w]-d[v]);let D=~~(m1*n.length);D===n.length&&(D=n.length-1);const w1=n[D];for(let w=0;w<3;w++)t.data[c+w]=u[w1][w];c%(i*4)===0&&e&&e(c,s,t)}return t}const u1=[Y,{id:"ProcPatternDither",name:"Pattern Dithering",run:d1,maxAllowedPaletteSize:65536,supports:{threads:!0,gamma:!0},complexity:t=>t*64}],A=self,f1=(t,r,o)=>{A.postMessage({msg:0,params:{current:t,total:r,partial:o}})};A.addEventListener("message",t=>{var s;const r=t.data,o=(s=r.options.process.process)==null?void 0:s.name,e=r.options.process.settingValues,u=u1.find(i=>i.name===o);if(!u){A.postMessage({msg:2,params:{error:`WorkerInit failed: process ${o} not found`}}),self.close();return}J(e.gamma||2.2),u.run(r.dataIn,r.options,e,f1),A.postMessage({msg:1,params:{result:r.dataIn}}),self.close()})})();