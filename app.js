/* LE TOUAREG — site statique. Aucun serveur, aucun paiement en ligne.
   Panier, favoris, dernière commande et espace équipe vivent dans le navigateur (localStorage). */
'use strict';
/* 1. CONFIGURATION (tout se modifie ici) */
window.SITE={name:'Le Touareg',logoLe:'LE',logoName:'TOUAREG',logoAccent:'',tagline:'Kebab · Tacos · Burgers',
 cuisine:['Kebab','French tacos','Sandwich','Burgers'],priceRange:'€€',domain:'',whatsapp:'33164248754',phone:'+33164248754',phoneDisplay:'01 64 24 87 54',
 email:'jamel.tp@hotmail.com',street:'11 Bis Pl. Diderot',postalCode:'77130',city:'Montereau-Fault-Yonne',
 uberEatsUrl:'',googleUrl:'',googleRating:{value:'4.1',count:'111'},uberRating:{value:'4.2',count:'180+'},
 teamPin:'0000', /* À CHANGER. Simple verrou d'interface côté navigateur : ce n'est PAS une sécurité. */
 pay:['UpDéjeuner','Bimpli (ex Apetiz)','Pluxee','Swile','Ticket Restaurant®'],
 legal:{companyName:'',legalForm:'',capital:'',publisher:'',host:'',hostAddress:'',mediator:'',vat:'',siret:'51164956800017',
  registry:"CCI — Chambre de Commerce et d'Industrie",address:'11 B place Diderot, 77130 Montereau-Fault-Yonne',
  statement:'Ce commerçant certifie que ses produits sont conformes aux lois en vigueur.'}};
const HOURS_BY_DAY=[0,1,2,3,4,5,6].map(day=>({day,open:11,close:23}));
const DAYS=['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'],DAYS_EN=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
/* 2. CATÉGORIES */
const CATEGORIES=[['menus-sandwiches','Menus sandwiches'],['menus-paninis','Menus paninis'],['menus-tacos','Menus tacos'],['menus-burgers','Menus burgers'],['menus-pizzas-turque','Menus pizzas turque'],['menus-croques','Menus croques'],['texmex','Tex-Mex'],['salades','Salades'],['pizzas','Pizzas'],['tacos','Tacos'],['burgers','Burgers'],['sandwiches','Sandwiches'],['assiettes','Assiettes'],['pizzas-turque','Pizzas turque'],['paninis','Paninis'],['croques','Croques'],['buckets','Buckets'],['desserts','Desserts'],['boissons','Boissons']].map(([id,label])=>({id,label}));
/* 3. OPTIONS & RÈGLES DE CONFIGURATION (listes à valider avec le restaurant) */
const MEATS={all:['Kebab','Poulet','Steak haché','Tenders','Nuggets','Cordon bleu','Poulet curry','Poulet tandoori','Viande hachée','Merguez'],
 plate:['Kebab','Poulet','Steak haché','Poulet curry','Poulet tandoori','Viande hachée','Merguez'],
 pizza:['Kebab','Poulet','Viande hachée','Poulet curry','Poulet tandoori','Merguez'],
 panini:['Kebab','Poulet','Viande hachée','Poulet curry','Poulet tandoori','Merguez']};
const SAUCES=['Fromagère maison','Sauce blanche','Harissa','Ketchup','Algérienne','Samouraï','Cocktail'];
const DRINKS=['Pepsi','Lipton Ice Tea','Coca-Cola','Sans boisson'];
const PIZZA_BASES=['Tomate','Crème']; /* liste non fournie : à modifier ici */
const CONFIG_RULES=[{re:/tacos l$/i,cfg:{meats:1,list:'all',sauces:1}},{re:/tacos xl$/i,cfg:{meats:2,list:'all',sauces:1}},
 {re:/assiette classique/i,cfg:{meats:1,list:'plate',sauces:1}},{re:/assiette mixte/i,cfg:{meats:4,list:'plate',sauces:1}},
 {re:/^(menu )?pizza (?!turque)/i,cfg:{base:1}},{re:/pizza 3 viandes/i,cfg:{meats:3,list:'pizza'}},
 {re:/panini 1 viande/i,cfg:{meats:1,list:'panini'}},{re:/sandwich/i,cfg:{sauces:1}},{re:/sandwich mixte/i,cfg:{meats:2,list:'all'}},
 {re:/sandwich (forma|spécial)/i,cfg:{meats:1,list:'all'}},{re:/bucket (kebab|chicken)/i,cfg:{sauces:1}}];
/* 4. PRODUITS (générés depuis des listes compactes) */
const POP=['Menu sandwich chicken curry','Menu sandwich kebab','Menu panini fromage','Menu tacos L','Menu tacos XL','Menu big burger','Menu cheese burger','Menu zinger burger','Pizza Margherita','Pizza Touareg','Pizza combine','Pizza chèvre miel','Pizza chicken','Pizza saumon','Pizza 3 viandes','Sandwich kebab','Sandwich cordon bleu','Sandwich américain','Big burger','Double cheeseburger','Pizza turque','Croque monsieur','Bucket frites','Tiramisu','Tarte au Daim','Lipton Ice Tea','Coca-Cola'];
const norm=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const slug=s=>norm(s).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const lc1=s=>s[0].toLowerCase()+s.slice(1);
const PRODUCTS=[];
function cfgOf(p){const c={};CONFIG_RULES.forEach(r=>{if(r.re.test(p.name))Object.assign(c,r.cfg)});if(p.menu)c.drink=1;return Object.keys(c).length?c:null}
function add(cat,name,price,desc){const p={id:slug(name),name,desc:desc||'',price,cat,popular:POP.includes(name),menu:cat.indexOf('menus-')===0};p.cfg=cfgOf(p);PRODUCTS.push(p)}
const SW=[['chicken curry',7.8,10.4,'Poulet mariné, sauce curry et fromage.'],['kebab',7.8,10.4,'Viande kebab, salade, tomates et oignons.'],['paprika',7.8,10.4,'Poulet mariné, paprika et crème fraîche.'],['mixte',7.8,10.4,'2 viandes au choix et fromage.'],['cordon bleu',6.5,8.45,'Poulet mariné, sauce curry et fromage.'],['double croc',7.8,10.4,'2 steaks 45 g, cordon bleu et fromage.'],['Boursin',7.8,10.4,'Poulet mariné, sauce curry et fromage.'],['shempa',7.8,10.4,'Chicken, crème fraîche, fromage râpé et champignons.'],['Touareg',7.8,10.4,'Steak viande hachée, œuf, fromage, olives, oignons et tomates.'],['kefta',7.8,10.4,'2 steaks, viande hachée et fromage.'],["brochette d'agneau",7.8,10.4,"Brochette d'agneau et fromage."],['américain',9.1,10.4,'2 steaks 45 g, œuf et fromage.'],['forma',9.1,11.05,'Viande au choix, crème fraîche, fromage râpé, lardons, œuf et GPT.'],['zinger rolo',9.1,11.05,'Pita poulet façon KFC, bacon de dinde, steak 45 g, 1 GPT et fromage.'],['spécial',9.1,11.05,'Pita, viande marinée au choix, oignons frits, borcha et cordon bleu.']];
const PA=[['thon','Panini pressé, garni de thon.','Panini grillé garni de thon.'],['fromage','Panini grillé, fromage fondu.','Panini garni de fromage fondu.'],['saumon','Pain panini pressé garni de saumon.','Panini garni de saumon.'],['bolognaise','Panini garni de sauce bolognaise, pain pressé et chaud.','Panini garni de sauce bolognaise, pain pressé et chaud.'],['1 viande','1 viande au choix.',"Panini garni d'1 viande au choix. Formule menu.",'1 viande au choix']];
const TA=[['Tacos L',9.1,11.05,'1 viande au choix.'],['Tacos XL',10.4,13,'2 viandes au choix.']];
const BU=[['Double big burger',10.4,13,'2 steaks 180 g, 2 fromages, salade et tomates.'],['Big burger',7.8,10.4,'1 steak 180 g, 2 fromages, salade et tomates.'],['Double big burger plus',13,15.6,'2 steaks 180 g, GPT, œuf et 2 fromages.'],['Cheese burger',3.9,7.15,'1 steak et fromage.'],['Double cheeseburger',5.2,8.45,'2 steaks et 2 fromages.'],['Chicken burger',5.2,7.8,'Chicken pané et fromage.'],['Zinger burger',5.85,8.45,'Poulet façon KFC et fromage.'],['Fish burger',4.55,7.15,'Poisson pané, salade, oignons et fromage.'],['Burger maison',7.15,9.1,'Steak viande hachée 100 g, fromage, raclette, salade, tomates et oignons.'],['Burger végétarien',5.2,7.8,'Steak de pommes de terre, œuf et fromage.']];
const PZ=[['Margherita','fromage et oignons.'],['Touareg','fromage, poulet, sauce fromagère et pommes de terre.'],['combine','fromage, viande hachée, champignons et œuf.'],['orientale','fromage, oignons, olives, merguez et œuf.'],['saisons','fromage, jambon dinde, olives, poivrons et champignons.'],['végétarien','fromage, olives, poivrons, champignons et oignons.'],['chèvre miel','fromage, chèvre et miel.'],['chicken','fromage, chicken et pommes de terre.'],['saumon','fromage, saumon et pommes de terre.'],['thon','fromage, thon et olives.']];
SW.forEach(([n,,m,d])=>add('menus-sandwiches','Menu sandwich '+n,m,d));
PA.forEach(([n,,d,mn])=>add('menus-paninis','Menu panini '+(mn||n),8.45,d));
TA.forEach(([n,,m,d])=>add('menus-tacos','Menu '+lc1(n),m,d));
BU.forEach(([n,,m,d])=>add('menus-burgers','Menu '+lc1(n),m,d));
add('menus-pizzas-turque','Menu pizza turque',7.8,'Spécialité turque de pâte garnie façon pizza. Formule menu.');
add('menus-croques','Menu croque monsieur',6.5,'Pain de mie, jambon et fromage.');
[['Nuggets',2.6],['Tenders',5.2],['Camembert',2.6],['Jalapenos',3.9],['Onion rings',2.6]].forEach(([n,p])=>add('texmex',n,p,'3 pièces.'));
add('salades','Salade César',7.8,'Salade, tomates, poulet frit, copeaux de fromage et maïs.');add('salades','Salade niçoise',6.5,'Salade, tomates, olives, maïs et thon.');add('salades','Salade mixte',5.2,'Salade, tomates et olives.');
PZ.forEach(([n,d])=>add('pizzas','Pizza '+n,9.75,'Base au choix, '+d+' Taille sénior.'));add('pizzas','Pizza 3 viandes',9.75,'Base et 3 viandes au choix et fromage. Taille sénior.');
TA.forEach(([n,p,,d])=>add('tacos',n,p,d));BU.forEach(([n,p,,d])=>add('burgers',n,p,d));SW.forEach(([n,p,,d])=>add('sandwiches','Sandwich '+n,p,d));
add('assiettes','Assiette classique',13,'1 viande au choix.');add('assiettes','Assiette mixte',14.3,'4 viandes au choix.');
add('pizzas-turque','Pizza turque',5.85,'Pâte fine façon turque, garniture et assaisonnement traditionnels.');
PA.forEach(([n,d])=>add('paninis','Panini '+n,5.85,d));add('croques','Croque monsieur',3.9,'Sandwich chaud au jambon et fromage.');
add('buckets','Bucket frites',2.6,'Seau de frites, format à partager.');add('buckets','Bucket kebab',9.1,'Viande kebab, format bucket.');add('buckets','Bucket chicken',9.1,'Morceaux de poulet servis en bucket, à partager.');
add('desserts','Tiramisu',3.9,'Classique italien au café, biscuits imbibés et crème mascarpone, saupoudré de cacao.');add('desserts','Tarte au Daim',3.9);
['Pepsi','Lipton Ice Tea','Coca-Cola'].forEach(n=>add('boissons',n,1.95));
/* Photos : seules 3 illustrations génériques existent (temporaires). Ailleurs : placeholder. */
const PHOTO={burgers:'food-burger','menus-burgers':'food-burger',tacos:'food-wrap','menus-tacos':'food-wrap',sandwiches:'food-kebab','menus-sandwiches':'food-kebab'};
const ACCENTS=['#B4482A','#23402F','#8F5A1F','#4A2C1E'];
/* 5. OUTILS, ÉTAT & STOCKAGE LOCAL */
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const eur=n=>n.toLocaleString('fr-FR',{style:'currency',currency:'EUR'});
const LS={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const P=id=>PRODUCTS.find(p=>p.id===id),byName=n=>PRODUCTS.find(p=>p.name===n);
const today=()=>new Date().toISOString().slice(0,10);
const state={cat:'all',pri:'all',q:'',cart:LS.get('tg_cart',[]).filter(i=>P(i.id)),favs:LS.get('tg_favs',[])};
const unavail=()=>{const u=LS.get('tg_unav',{});return u.d===today()?u.ids:[]};
const accent=cat=>ACCENTS[CATEGORIES.findIndex(c=>c.id===cat)%4];
const rate=v=>String(v).replace('.',',');
const waLink=t=>'https://wa.me/'+SITE.whatsapp+'?text='+encodeURIComponent(t);
const mapsQ=encodeURIComponent(SITE.name+' '+SITE.street+' '+SITE.postalCode+' '+SITE.city);
const ICON={heart:'M12 21s-8-5.3-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.7-8 11-8 11z',share:'M4 12v7h16v-7M12 3v12M7 8l5-5 5 5'};
const ic=n=>`<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="${ICON[n]}"/></svg>`;
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('on'),2200)}
/* 6. HORAIRES */
function hoursInfo(now=new Date()){const d=now.getDay(),h=now.getHours()+now.getMinutes()/60,t=HOURS_BY_DAY.find(x=>x.day===d);
 if(t&&h>=t.open&&h<t.close)return{open:true,text:`Ouvert maintenant · fermeture à ${t.close}h`};
 for(let i=0;i<8;i++){const dd=(d+i)%7,x=HOURS_BY_DAY.find(y=>y.day===dd);if(!x||(i===0&&h>=x.open))continue;return{open:false,text:`Fermé maintenant · ouvre ${i===0?"aujourd'hui":i===1?'demain':DAYS[dd]} à ${x.open}h`}}
 return{open:false,text:'Fermé maintenant'}}
function renderStatus(){const s=hoursInfo();$('#hs').textContent=s.open?'Ouvert jusqu\'à 23h':s.text;$('#ann').textContent=s.text+' · Sur place, à emporter, livraison';
 $$('.hnow').forEach(e=>e.textContent=s.text);$$('.ht tr').forEach(r=>r.classList.toggle('now',+r.dataset.d===new Date().getDay()))}
/* 7. RENDU PRODUIT */
function cardHTML(p){const fav=state.favs.includes(p.id),off=unavail().includes(p.id),ph=PHOTO[p.cat],lab=CATEGORIES.find(c=>c.id===p.cat).label;
 return `<article class="card${off?' off':''}" data-id="${esc(p.id)}"><div class="th" style="--c:${accent(p.cat)}">${ph?`<img src="${ph}-480.jpg" srcset="${ph}-480.jpg 480w,${ph}-840.jpg 840w" sizes="96px" loading="lazy" alt="">`:esc(lab)}</div>
 <div><h3>${esc(p.name)}${p.popular?'<span class="bd">Populaire</span>':''}</h3>${p.desc?`<p>${esc(p.desc)}</p>`:''}
 <div class="cf"><strong>${eur(p.price)}</strong><span class="ca"><button class="ib" data-act="fav" aria-pressed="${fav}" aria-label="${fav?'Retirer des':'Ajouter aux'} favoris : ${esc(p.name)}">${ic('heart')}</button><button class="ib" data-act="share" aria-label="Partager ${esc(p.name)}">${ic('share')}</button><button class="btn sm" data-act="add"${off?' disabled':''}>${off?'Indisponible':p.cfg?'Choisir':'Ajouter'}</button></span></div></div></article>`}
/* 8. CATALOGUE */
function renderChips(){const c=[['all','Tout voir'],['fav','Mes favoris'],...CATEGORIES.map(x=>[x.id,x.label])];
 $('#catF').innerHTML=c.map(([id,l])=>`<button data-cat="${id}" aria-pressed="${state.cat===id}">${esc(l)}</button>`).join('');
 $('#priF').innerHTML=[['all','Tous les prix'],['lt','Moins de 10 €'],['mid','10 € – 15 €'],['gt','Plus de 15 €']].map(([id,l])=>`<button data-pri="${id}" aria-pressed="${state.pri===id}">${l}</button>`).join('')}
const priceOk=v=>state.pri==='all'||(state.pri==='lt'?v<10:state.pri==='mid'?v>=10&&v<=15:v>15);
function renderMenu(){const q=norm(state.q),f=state.cat;
 const list=PRODUCTS.filter(p=>(f==='all'||(f==='fav'&&state.favs.includes(p.id))||p.cat===f)&&priceOk(p.price)&&(!q||norm(p.name+' '+p.desc).includes(q)));
 $('#grid').innerHTML=CATEGORIES.map(c=>{const l=list.filter(p=>p.cat===c.id);return l.length?`<h3 class="gh">${esc(c.label)}</h3><div class="g">${l.map(cardHTML).join('')}</div>`:''}).join('')||'<p class="mut">Aucun plat ne correspond à votre recherche.</p>';
 $('#info').textContent=`${list.length} produit${list.length>1?'s':''}`}
function renderBest(){$('#hsb').innerHTML=['Menu sandwich chicken curry','Menu sandwich kebab','Menu tacos XL','Menu big burger','Menu double cheeseburger','Menu panini fromage','Pizza Touareg','Sandwich kebab'].map(byName).map(cardHTML).join('')}
function renderShowcase(){const S=[['01','Tacos','tacos','food-wrap-840.jpg',['Tacos L','Tacos XL'],'#B4482A'],['02','Burgers','burgers','food-burger-840.jpg',['Big burger','Double big burger','Burger maison'],'#8F5A1F'],['03','Kebab & sandwichs','sandwiches','food-kebab-840.jpg',['Sandwich Touareg','Sandwich kebab'],'#23402F'],['04','Pizzas','pizzas','plateau-840.webp',['Pizza Touareg','Pizza 3 viandes','Pizza chèvre miel'],'#4A2C1E']];
 $('#show').innerHTML=S.map(([n,t,c,img,names,a])=>{const pr=Math.min(...names.map(x=>byName(x).price));return `<a class="pan rv" href="#carte" data-cat="${c}" style="--a:${a}"><img src="${img}" alt="Illustration temporaire : ${esc(t)}" loading="lazy"><b>${n}</b><h3>${esc(t)}</h3><p>${esc(names.join(' · '))} — dès ${eur(pr)}</p></a>`}).join('')}
function renderClassics(){$('#clb').innerHTML=[['Sandwich Touareg','food-kebab-840.jpg'],['Pizza Touareg','plateau-840.webp'],['Burger maison','food-burger-840.jpg'],['Tacos XL','food-wrap-840.jpg']].map(([n,img])=>{const p=byName(n);return `<article class="rv" data-id="${p.id}"><img src="${img}" alt="Illustration temporaire" loading="lazy"><h3 style="font-size:2rem">${esc(p.name)}</h3><p>${esc(p.desc)}</p><p style="margin:6px 0"><strong>${eur(p.price)}</strong></p><button class="btn sm" data-act="add">${p.cfg?'Choisir':'Ajouter'}</button></article>`}).join('')}
/* 9. CONFIGURATEUR */
let cur=null;
const grp=(t,type,name,list,max)=>`<fieldset style="border:0;padding:0;margin-bottom:14px"><legend style="font-weight:800;margin-bottom:6px">${t}<span class="mut" data-cnt="${name}"></span></legend>${list.map(v=>`<label class="opt"><input type="${type}" name="${name}" value="${esc(v)}"><span>${esc(v)}</span></label>`).join('')}</fieldset>`;
function openCfg(id){const p=P(id);if(!p)return;cur={p,meats:[],sauces:[],drink:null,base:null};const c=p.cfg;
 $('#cfgT').textContent=p.name;$('#cfgD').textContent=eur(p.price)+(p.desc?' · '+p.desc:'');
 $('#cfgB').innerHTML=(c.base?grp('Base','radio','base',PIZZA_BASES):'')+(c.meats?grp(`Viande${c.meats>1?'s':''} (${c.meats})`,'checkbox','meat',MEATS[c.list]):'')+(c.sauces?grp('Sauces offertes (2 max)','checkbox','sauce',SAUCES):'')+(c.drink?grp('Boisson','radio','drink',DRINKS):'');
 syncCfg();openOv('cfg')}
function syncCfg(){const c=cur.p.cfg,b=$('#cfgB'),v=n=>$$(`input[name=${n}]:checked`,b).map(i=>i.value);
 cur.meats=v('meat');cur.sauces=v('sauce');cur.drink=v('drink')[0]||null;cur.base=v('base')[0]||null;
 $$('input[name=meat]',b).forEach(i=>i.disabled=!i.checked&&cur.meats.length>=c.meats);$$('input[name=sauce]',b).forEach(i=>i.disabled=!i.checked&&cur.sauces.length>=2);
 const m=$('[data-cnt=meat]',b),s=$('[data-cnt=sauce]',b);if(m)m.textContent=` ${cur.meats.length}/${c.meats}`;if(s)s.textContent=` ${cur.sauces.length}/2`;
 const ok=(!c.base||cur.base)&&(!c.meats||cur.meats.length===c.meats)&&(!c.drink||cur.drink),a=$('#cfgA');a.disabled=!ok;a.textContent=ok?`Ajouter · ${eur(cur.p.price)}`:'Complétez vos choix'}
/* 10. PANIER */
function track(n,q){const s=LS.get('tg_stats',{});if(s.d!==today()){s.d=today();s.c={}}s.c[n]=(s.c[n]||0)+q;LS.set('tg_stats',s)}
function addToCart(p,o){const k=p.id+JSON.stringify(o||{}),it=state.cart.find(i=>i.k===k);it?it.qty++:state.cart.push({k,id:p.id,qty:1,o:o||{}});track(p.name,1);saveCart();toast(p.name+' ajouté au panier');$('#bd').classList.remove('bump');void $('#bd').offsetWidth;$('#bd').classList.add('bump')}
const saveCart=()=>{LS.set('tg_cart',state.cart);renderCart()};
const total=()=>state.cart.reduce((s,i)=>s+i.qty*P(i.id).price,0);
function optLines(o){const l=[];if(o.base)l.push('base : '+o.base);if(o.meats&&o.meats.length)l.push(`${o.meats.length} viande${o.meats.length>1?'s':''} : ${o.meats.join(' + ')}`);if(o.sauces&&o.sauces.length)l.push(`sauce${o.sauces.length>1?'s':''} : ${o.sauces.join(' + ')}`);if(o.drink)l.push('boisson : '+o.drink);return l}
function renderCart(){const n=state.cart.reduce((s,i)=>s+i.qty,0);$('#bd').textContent=n;const f=$('#fab');f.hidden=!n;f.textContent=`Voir mon panier · ${n} article${n>1?'s':''} · ${eur(total())}`;
 $('#cartF').hidden=!n;$('#ct').textContent=eur(total());
 $('#cartB').innerHTML=n?state.cart.map(i=>{const p=P(i.id);return `<div class="ci"><div><strong>${esc(p.name)}</strong>${optLines(i.o).map(l=>`<small>${esc(l)}</small>`).join('')}<small>${eur(p.price*i.qty)}</small></div><div class="q"><button data-act="qty" data-k="${esc(i.k)}" data-d="-1" aria-label="Retirer un ${esc(p.name)}">−</button><span aria-label="Quantité">${i.qty}</span><button data-act="qty" data-k="${esc(i.k)}" data-d="1" aria-label="Ajouter un ${esc(p.name)}">+</button><button class="ib" data-act="del" data-k="${esc(i.k)}" aria-label="Supprimer ${esc(p.name)}">🗑</button></div></div>`}).join(''):`<p class="mut">Votre panier est vide.</p>${LS.get('tg_last',null)?'<p><button class="btn alt" data-act="reorder">Reprendre ma dernière commande</button></p>':''}`}
/* 11. WHATSAPP */
function buildMsg(){const nm=$('#cn').value.trim(),rm=$('#cr').value.trim();
 return `Bonjour ${SITE.name},\n\nJe souhaite passer la commande suivante :\n\n`+state.cart.map(i=>`- ${i.qty} × ${P(i.id).name}`+optLines(i.o).map(l=>`\n  - ${l}`).join('')).join('\n')+`\n\nTotal estimé : ${eur(total())}`+(nm?`\n\nPrénom : ${nm}`:'')+(rm?`\nRemarque : ${rm}`:'')+'\n\nMerci !'}
function sendWA(){if(!state.cart.length)return toast('Votre panier est vide');LS.set('tg_last',state.cart);window.open(waLink(buildMsg()),'_blank','noopener');renderLast()}
function waCta(){state.cart.length?openOv('cart'):window.open(waLink('Bonjour '+SITE.name+', je souhaite passer commande.'),'_blank','noopener')}
/* 12. FAVORIS & PARTAGE */
function toggleFav(id){const i=state.favs.indexOf(id);i<0?state.favs.push(id):state.favs.splice(i,1);LS.set('tg_favs',state.favs);renderMenu();renderBest()}
async function share(id){const p=P(id),url=location.origin+location.pathname+'?q='+encodeURIComponent(p.name)+'#carte';
 if(navigator.share){try{await navigator.share({title:p.name+' — '+SITE.name,text:p.name+' chez '+SITE.name,url})}catch(e){}return}
 try{await navigator.clipboard.writeText(url);toast('Lien copié')}catch(e){toast('Copie impossible : '+url)}}
/* 13. DERNIÈRE COMMANDE */
const renderLast=()=>{$('#reo').hidden=!LS.get('tg_last',null)};
function reorder(){const l=(LS.get('tg_last',[])||[]).filter(i=>P(i.id));if(!l.length)return toast('Aucune commande enregistrée');state.cart=l;saveCart();openOv('cart')}
/* 14. INFOS, AVIS, FAQ, SEO */
const faq=()=>[['Le Touareg est-il ouvert tous les jours ?','Oui, tous les jours de 11h à 23h selon les horaires fournis.'],['Où se trouve Le Touareg ?',`${SITE.street}, ${SITE.postalCode} ${SITE.city}.`],['Comment commander ?','Choisissez vos plats sur le site, puis envoyez votre commande au restaurant via WhatsApp. Aucun paiement n\'est effectué en ligne.'],['Le Touareg livre-t-il ?',SITE.uberEatsUrl?'Le restaurant propose la livraison sans contact via Uber Eats (bouton « Commander sur Uber Eats »).':'Le restaurant propose la livraison sans contact. Le lien de commande Uber Eats sera ajouté prochainement.'],['Quels moyens de paiement sont acceptés ?','UpDéjeuner, Bimpli (ex Apetiz), Pluxee, Swile et Ticket Restaurant®.'],['Puis-je personnaliser mon tacos ?','Oui, selon le produit : choisissez vos viandes, vos sauces et votre boisson.'],['Puis-je connaître les allergènes ?',`Oui : contactez le restaurant avant de commander au ${SITE.phoneDisplay}.`],['Peut-on retirer la commande sur place ?','Oui, le restaurant propose la vente à emporter et les repas sur place.']];
function renderInfo(){const L=SITE.legal,gm=SITE.googleUrl||'https://www.google.com/maps/search/?api=1&query='+mapsQ;
 $('#tel').innerHTML=`<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg><span>${esc(SITE.phoneDisplay)}</span>`;$('#tel').href='tel:'+SITE.phone;
 $('#tel2').textContent='Appeler '+SITE.phoneDisplay;$('#tel2').href='tel:'+SITE.phone;$('#hm').textContent=`${SITE.street} · ${SITE.postalCode} ${SITE.city} · ${rate(SITE.googleRating.value)}/5 · ${SITE.googleRating.count} avis Google`;
 if(SITE.uberEatsUrl){$('#ue').hidden=false;$('#ue').href=SITE.uberEatsUrl}
 $('#tr').innerHTML=['Repas sur place','Vente à emporter','Livraison','Ouvert 7j/7','Paiement titres restaurant',SITE.city].map(t=>`<li>${esc(t)}</li>`).join('');
 $('#st').innerHTML=[[rate(SITE.googleRating.value)+'/5','Note Google'],[SITE.googleRating.count,'Avis Google'],['7j/7','Ouvert'],[SITE.pay.length,'Titres restaurant acceptés'],[PRODUCTS.length,'Références à la carte']].map(([v,l])=>`<div><strong>${esc(v)}</strong>${esc(l)}</div>`).join('');
 $('#avb').innerHTML=`<div><strong>${rate(SITE.googleRating.value)} / 5</strong><p>${SITE.googleRating.count} avis Google</p><a class="btn sm alt" href="${esc(gm)}" target="_blank" rel="noopener">Voir sur Google Maps</a></div><div><strong>${rate(SITE.uberRating.value)} / 5</strong><p>sur Uber Eats · ${SITE.uberRating.count} notes</p>${SITE.uberEatsUrl?`<a class="btn sm alt" href="${esc(SITE.uberEatsUrl)}" target="_blank" rel="noopener">Voir sur Uber Eats</a>`:''}</div>`;
 $('#inf').innerHTML=`<p><strong>${esc(SITE.street)}</strong><br>${SITE.postalCode} ${esc(SITE.city)}</p><p><a href="tel:${SITE.phone}"><strong>${SITE.phoneDisplay}</strong></a></p><p class="hnow"></p><table class="ht">${[1,2,3,4,5,6,0].map(d=>{const h=HOURS_BY_DAY.find(x=>x.day===d);return `<tr data-d="${d}"><td>${DAYS[d]}</td><td>${h.open}h – ${h.close}h</td></tr>`}).join('')}</table><p><strong>Paiement :</strong> ${esc(SITE.pay.join(', '))}</p><p><a class="btn" href="https://www.google.com/maps/dir/?api=1&destination=${mapsQ}" target="_blank" rel="noopener">Itinéraire</a> <a class="btn alt" href="${esc(gm)}" target="_blank" rel="noopener">Ouvrir dans Google Maps</a></p>`;
 $('#fq').innerHTML=faq().map(([q,a])=>`<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('');
 $('#ft').innerHTML=`<div><h3>${SITE.name}</h3><p>Kebab · French tacos · Sandwich · Burgers</p><p>${esc(SITE.street)}<br>${SITE.postalCode} ${esc(SITE.city)}</p><a href="tel:${SITE.phone}">${SITE.phoneDisplay}</a><a href="mailto:${SITE.email}">${SITE.email}</a></div><div><strong>Navigation</strong><a href="#carte">La Carte</a><a href="#best">Best-sellers</a><a href="#avis">Avis</a><a href="#infos">Infos &amp; Accès</a></div><div><strong>Informations</strong>${['mentions:Mentions légales','privacy:Confidentialité','allergens:Allergènes','cookies:Cookies'].map(x=>{const[k,l]=x.split(':');return `<button data-act="legal" data-k="${k}">${l}</button>`}).join('<br>')}<br><button data-act="legal" data-k="team">Espace équipe</button></div><div><strong>Paiement accepté</strong>${SITE.pay.map(esc).map(x=>`<span>${x}</span><br>`).join('')}<small>SIRET ${esc(L.siret)} · Images : illustrations temporaires</small></div>`}
function seo(){const S=SITE,pad=n=>String(n).padStart(2,'0');
 const ld=[{'@context':'https://schema.org','@type':'FastFoodRestaurant',name:S.name,address:{'@type':'PostalAddress',streetAddress:S.street,postalCode:S.postalCode,addressLocality:S.city,addressCountry:'FR'},telephone:S.phone,servesCuisine:S.cuisine,priceRange:S.priceRange,openingHoursSpecification:HOURS_BY_DAY.map(h=>({'@type':'OpeningHoursSpecification',dayOfWeek:DAYS_EN[h.day],opens:pad(h.open)+':00',closes:pad(h.close)+':00'}))},{'@context':'https://schema.org','@type':'FAQPage',mainEntity:faq().map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))}];
 if(S.domain){ld[0].url=S.domain;const l=document.createElement('link');l.rel='canonical';l.href=S.domain;document.head.append(l)}
 const s=document.createElement('script');s.type='application/ld+json';s.textContent=JSON.stringify(ld);document.head.append(s)}
/* 15. COOKIES & GOOGLE MAPS (jamais chargé avant accord) */
const consent=()=>LS.get('tg_consent',null);
function setConsent(v){LS.set('tg_consent',v);$('#ck').hidden=true;if(v==='no'){$('#map').innerHTML='';renderMap()}toast(v==='yes'?'Préférence enregistrée : Google Maps autorisé':'Préférence enregistrée : Google Maps bloqué')}
function renderMap(){$('#map').innerHTML=`<div class="map-placeholder"><p><strong>Carte Google Maps</strong></p><p class="mut" style="margin:6px 0 14px;font-size:.9rem">Elle ne se charge qu'avec votre accord (Google peut alors déposer des cookies).</p><button class="btn" data-act="map">Afficher la carte</button></div>`}
function loadMap(){LS.set('tg_consent','yes');$('#ck').hidden=true;$('#map').innerHTML=`<iframe title="Plan : ${esc(SITE.name)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=${mapsQ}&output=embed"></iframe>`}
/* 16. MODALES LÉGALES & 17. ESPACE ÉQUIPE */
const td=v=>v?esc(v):'<span class="todo">à compléter</span>';
function legal(k){const L=SITE.legal,T={mentions:'Mentions légales',privacy:'Confidentialité',allergens:'Allergènes',cookies:'Cookies',team:'Espace équipe'};$('#lgT').textContent=T[k];let h='';
 if(k==='mentions')h=`<p><strong>${esc(SITE.name)}</strong> — restauration rapide</p><p>Raison sociale : ${td(L.companyName)}<br>Forme juridique : ${td(L.legalForm)}<br>Capital : ${td(L.capital)}<br>Adresse : ${esc(L.address)}<br>SIRET : ${esc(L.siret)}<br>Registre : ${esc(L.registry)}<br>TVA intracommunautaire : ${td(L.vat)}<br>Responsable de publication : ${td(L.publisher)}<br>Hébergeur : ${td(L.host)} — ${td(L.hostAddress)}<br>Médiateur de la consommation : ${td(L.mediator)}<br>Contact : ${esc(SITE.email)} · ${SITE.phoneDisplay}</p><p>${esc(L.statement)}</p>`;
 if(k==='privacy')h=`<p>Ce site n'a pas de serveur : votre panier, vos favoris et votre dernière commande restent dans votre navigateur. Prénom et remarque ne sont transmis que lorsque vous envoyez votre commande via WhatsApp (service tiers). Aucune donnée bancaire n'est collectée.</p>`;
 if(k==='allergens')h=`<p>La liste des allergènes n'est pas publiée sur ce site. Avant de commander, contactez le restaurant au <a href="tel:${SITE.phone}">${SITE.phoneDisplay}</a> ou indiquez-le dans la remarque de commande.</p>`;
 if(k==='cookies')h=`<p>Aucun cookie publicitaire. Seul Google Maps peut en déposer, et uniquement si vous l'autorisez. Choix actuel : <strong>${{yes:'accepté',no:'refusé'}[consent()]||'non défini'}</strong>.</p><div class="cta"><button class="btn sm" data-act="ck-yes">Accepter</button><button class="btn sm alt" data-act="ck-no">Refuser</button></div>`;
 if(k==='team')h=teamHTML(false);$('#lgB').innerHTML=h;openOv('lg')}
function teamHTML(ok){if(!ok)return `<p class="mut">Les données de cet espace restent dans CE navigateur (ni serveur, ni synchronisation). Le code PIN est un simple verrou d'interface, pas une sécurité.</p><input type="password" id="pin" inputmode="numeric" placeholder="Code PIN" aria-label="Code PIN"><p class="err" id="pinE" role="alert"></p><button class="btn" data-act="pin">Entrer</button>`;
 const s=LS.get('tg_stats',{}),r=s.d===today()?Object.entries(s.c).sort((a,b)=>b[1]-a[1]).slice(0,8):[],off=unavail();
 return `<h3>Ajouts au panier aujourd'hui (ce navigateur)</h3>${r.length?'<ol>'+r.map(([n,c])=>`<li>${esc(n)} — ${c}</li>`).join('')+'</ol>':'<p class="mut">Aucun ajout.</p>'}<h3>Indisponible aujourd'hui</h3>${PRODUCTS.map(p=>`<label class="opt"><input type="checkbox" data-av="${esc(p.id)}"${off.includes(p.id)?' checked':''}><span>${esc(p.name)}</span></label>`).join('')}`}
/* 18. OVERLAYS, ÉVÉNEMENTS & INITIALISATION */
let lastFocus=null;
function openOv(id){const o=$('#'+id);lastFocus=document.activeElement;o.hidden=false;document.body.style.overflow='hidden';(o.querySelector('input:not(:disabled),button:not(:disabled)')||o).focus()}
function closeOv(){const o=$$('.ov').filter(x=>!x.hidden).pop();if(!o)return;o.hidden=true;$('#bur').setAttribute('aria-expanded','false');if(!$$('.ov').some(x=>!x.hidden))document.body.style.overflow='';if(lastFocus)lastFocus.focus()}
document.addEventListener('click',e=>{
 if(e.target.classList.contains('ov'))return closeOv();
 const c=e.target.closest('[data-cat]');if(c){state.cat=c.dataset.cat;renderChips();renderMenu();return}
 const pr=e.target.closest('[data-pri]');if(pr){state.pri=pr.dataset.pri;renderChips();renderMenu();return}
 const t=e.target.closest('[data-act]');if(!t)return;const id=(t.closest('[data-id]')||{dataset:{}}).dataset.id,a=t.dataset.act;
 if(a==='close')closeOv();else if(a==='cart')openOv('cart');else if(a==='menu'){openOv('mn');$('#bur').setAttribute('aria-expanded','true')}
 else if(a==='fav')toggleFav(id);else if(a==='share')share(id);
 else if(a==='add'){const p=P(id);p.cfg?openCfg(id):addToCart(p)}
 else if(a==='cfgAdd'){addToCart(cur.p,{base:cur.base,meats:cur.meats,sauces:cur.sauces,drink:cur.drink});closeOv()}
 else if(a==='qty'||a==='del'){const i=state.cart.find(x=>x.k===t.dataset.k);if(i){i.qty+=a==='qty'?+t.dataset.d:-99;state.cart=state.cart.filter(x=>x.qty>0);saveCart()}}
 else if(a==='send')sendWA();else if(a==='wa')waCta();else if(a==='reorder')reorder();
 else if(a==='legal'){closeOv();legal(t.dataset.k)}else if(a==='ck-yes'){setConsent('yes');if($('#lg').hidden===false)legal('cookies')}else if(a==='ck-no'){setConsent('no');if($('#lg').hidden===false)legal('cookies')}
 else if(a==='map')loadMap();
 else if(a==='pin'){if($('#pin').value===SITE.teamPin)$('#lgB').innerHTML=teamHTML(true);else $('#pinE').textContent='Code incorrect.'}});
document.addEventListener('change',e=>{if(e.target.closest('#cfgB'))syncCfg();const v=e.target.dataset.av;if(v){const s=new Set(unavail());e.target.checked?s.add(v):s.delete(v);LS.set('tg_unav',{d:today(),ids:[...s]});renderMenu();renderBest()}});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeOv()});
$('#q').addEventListener('input',e=>{state.q=e.target.value;renderMenu()});
['cn','cr'].forEach(i=>{$('#'+i).value=LS.get('tg_'+i,'');$('#'+i).addEventListener('input',e=>LS.set('tg_'+i,e.target.value))});
addEventListener('scroll',()=>{const d=document.documentElement;$('#top').classList.toggle('sc',scrollY>20);$('#sp').style.width=(scrollY/(d.scrollHeight-innerHeight||1)*100)+'%'},{passive:true});
(function init(){const q=new URLSearchParams(location.search).get('q');if(q){state.q=q;$('#q').value=q}
 renderInfo();renderShowcase();renderBest();renderClassics();renderChips();renderMenu();renderCart();renderLast();renderMap();renderStatus();seo();setInterval(renderStatus,60000);
 if(!consent())$('#ck').hidden=false;
 const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.15});$$('.rv').forEach(x=>io.observe(x))})();
