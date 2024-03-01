import*as t from"fs";import{createHmac as e,createHash as s}from"crypto";import"uuid";import n from"axios";import*as a from"fs/promises";import i from"columnify";import r from"terminal-kit";import o from"delay";class c{cacheDir;getLogFile(t){let e=new Date;return t&&(e=new Date(t)),`${this.cacheDir}/${e.getUTCFullYear()}-${e.getUTCMonth()}-${e.getUTCDate()}-${e.getUTCHours()}.log`}constructor(e){this.cacheDir=e?`logs/${e}`:"logs/",t.existsSync(this.cacheDir)||t.mkdirSync(this.cacheDir,{recursive:!0})}log(e){const s=`${(new Date).toISOString()}::\t${e}\n`;t.writeFileSync(this.getLogFile(),s,{encoding:"utf-8",flag:"as"})}}function l(t,s){const n=e("sha512",s);return n.update(t,"utf-8"),n.digest().toString("hex").toLowerCase()}function u(t){const e=s("sha512");return e.update(t),e.digest().toString("base64url")}async function d(){return(await n.get("http://api.fulcrum-ai.dev:11451/announce")).data.msg}function g(){process.stdout.write("win32"===process.platform?"[2J[0f":"[2J[3J[H")}const h=n.create({baseURL:"http://api.fulcrum-ai.dev:11451/",headers:{"Content-Type":"application/json"},validateStatus:t=>t<=500});class m{cacheDir;credentials;logger;constructor(e,s,n){this.cacheDir=`.cache/${e}`,this.credentials={username:s||"",secretKey:n?u(n):""},t.existsSync(this.cacheDir)||t.mkdirSync(this.cacheDir,{recursive:!0}),this.logger=new c(e)}setCredentials(t,e){this.credentials.username=t||this.credentials.username,this.credentials.secretKey=e?u(e):this.credentials.secretKey}}const p=n.create({baseURL:"http://api.fulcrum-ai.dev:11451/",headers:{"Content-Type":"application/json"},validateStatus:t=>t<=500});const w=n.create({baseURL:"http://api.fulcrum-ai.dev:11451/",headers:{"Content-Type":"application/json"},validateStatus:t=>t<=500});const f=n.create({baseURL:"http://api.fulcrum-ai.dev:11451/",headers:{"Content-Type":"application/json"},validateStatus:t=>t<=500});const v=r.terminal,y=new class{logger;username;secretKey;assistantIds;conversationIds;invoiceIds;currAssistant;currConversation;balance;credentials;constructor(){this.conversationIds=[],this.assistantIds=[],this.conversationIds=[],this.invoiceIds=[],this.currAssistant="",this.currConversation="",this.balance=0,this.username="",this.secretKey="",this.credentials={username:"",secretKey:""},this.logger=new c("User")}getUsername(){return this.username}getBalance(){return this.balance}getCurrConversation(){return this.currConversation}getCurrAssistant(){return this.currAssistant}async login(t,e){const s=u(e),n={username:t},a=(await h.post("/login",JSON.stringify(n),{headers:{signature:l(JSON.stringify(n),s)}})).data;let i="";return a.status?(this.secretKey=s,this.username=t):(i=`Log in failed: ${a.msg}`,this.logger.log(i)),{status:a.status,errMsg:i}}setCurrConversation(t){return t.length?!!this.conversationIds.includes(t)&&(this.currConversation=t,!0):(this.currConversation="",!0)}setCurrAssistant(t){return!!this.assistantIds.includes(t)&&(this.currAssistant=t,!0)}async sendMessage(t){const e=this.currConversation?this.currConversation:"",s={username:this.username,message:t,assistantId:this.currAssistant,conversationId:e},n=await h.post("/message",JSON.stringify(s),{headers:{signature:l(JSON.stringify(s),this.secretKey)}}),a=n.data;return n.status&&a.status?{status:!0,content:a.content}:{status:!1,message:n.statusText+"\t"+a.msg}}async register(t,e,s,n){const a=(await h.post("/register",JSON.stringify({username:t,password:e,email:s,token:n}))).data;let i="";return a.status?(this.secretKey=u(e),this.username=t):(i=`Registration failed: ${a.msg}`,this.logger.log(i)),{status:a.status,errMsg:i}}listAssistantIds(){return this.assistantIds}listConversationIds(){return this.conversationIds}listInvoiceIds(){return this.invoiceIds}async sync(){const t={balance:this.balance,assistantIds:this.assistantIds,conversationIds:this.conversationIds,invoiceIds:this.invoiceIds},e={username:this.username,reqInfo:{hash:u(JSON.stringify(t))}},s=JSON.stringify(e),n=await h.post("/fetch",s,{headers:{signature:l(s,this.secretKey)}});if(!n.status)return void this.logger.log(`Data sync failed (external access error): ${n.statusText}`);const a=n.data;return a.status?(this.logger.log(`Data synced from server: \n${JSON.stringify(a.content,null,4)}`),a.content.assistantIds&&(this.assistantIds=a.content.assistantIds),a.content.conversationIds&&(this.conversationIds=a.content.conversationIds),a.content.invoiceIds&&(this.invoiceIds=a.content.invoiceIds),a.content.balance&&(this.balance=a.content.balance)):this.logger.log(`Data sync failed (server internal err): ${a.msg}`),a.status}isLoggedIn(){return this.username.length>0}async recharge(t){const e={username:this.username,operations:{recharge:t}},s=JSON.stringify(e),n=await h.post("/operations",s,{headers:{signature:l(s,this.secretKey)}});if(!n.status)return this.logger.log(`Operation failed (external access error): ${n.statusText}`),{status:!1,msg:`Operation failed (external access error): ${n.statusText}`};const a=n.data;return a.status?{status:!0,msg:a.content.invoiceId}:(this.logger.log(`Operation failed (server internal err): ${a.msg}`),{status:!1,msg:`Operation failed (server internal err): ${a.msg}`})}},C=new class extends m{Names;Ids;constructor(t,e){super("assistants",t,e),this.Names=new Map,this.Ids=new Map}async get(e){t.existsSync(`${this.cacheDir}/${e}.asst`)||await this.download([e]);const s=await a.readFile(`${this.cacheDir}/${e}.asst`,{encoding:"utf-8"});return JSON.parse(s)}getName(t){return this.Names.get(t)}getId(t){return t=t.toLowerCase(),this.Ids.get(t)}async download(t){const e={username:this.credentials.username,reqInfo:{assistantIds:t}},s=await f.post("/fetch",JSON.stringify(e),{headers:{signature:l(JSON.stringify(e),this.credentials.secretKey)}}),n=[];if(200!=s.status)return this.logger.log(`Download request failed (external): ${s.statusText} ${s.status}`),n;const i=s.data;if(!i.status)return this.logger.log(`Download request failed (internal): ${i.msg}`),n;const r=i.content.assistants;for(const t in r){const e=r[t];n.push(e.id),this.Names.set(e.id,e.name),this.Ids.set(e.name.toLowerCase(),e.id),await a.writeFile(`${this.cacheDir}/${e.id}.asst`,JSON.stringify(e,null,4),"utf-8")}return this.logger.log(`Downloaded assistant files from server: \n\t${n.join("\n\t")}`),n}async listInfo(t){const e=[];for(const s in t){const n=await this.get(t[s]);e.push(n)}return i(e,{columns:["name","id"],columnSplitter:"|"})}},I=new class extends m{constructor(t,e){super("conversations",t,e)}async get(t){await this.download([t]);const e=await a.readFile(`${this.cacheDir}/${t}.conv`,{encoding:"utf-8"});return JSON.parse(e)}async download(t){const e={username:this.credentials.username,reqInfo:{conversationIds:t}},s=await p.post("/fetch",JSON.stringify(e),{headers:{signature:l(JSON.stringify(e),this.credentials.secretKey)}}),n=[];if(200!=s.status)return this.logger.log(`Download request failed (external): ${s.statusText} ${s.status}`),n;const i=s.data;if(!i.status)return this.logger.log(`Download request failed (internal): ${i.msg}`),n;const r=i.content.conversations;for(const t in r){const e=r[t];n.push(e.id),await a.writeFile(`${this.cacheDir}/${e.id}.conv`,JSON.stringify(e,null,4),{encoding:"utf-8"})}return this.logger.log(`Downloaded conversation files from server: \n\t${n.join("\n\t")}`),n}async listInfo(t){const e=[];for(const s in t){const n=await this.get(t[s]);e.push(n)}return i(e,{columns:["title","id"],columnSplitter:"|"})}},$=new class extends m{constructor(t,e){super("invoices",t,e)}async get(e){t.existsSync(`${this.cacheDir}/${e}.invoice`)||await this.download([e]);const s=await a.readFile(`${this.cacheDir}/${e}.invoice`,"utf-8");return JSON.parse(s)}async download(t){const e={username:this.credentials.username,reqInfo:{invoiceIds:t}},s=await w.post("/fetch",JSON.stringify(e),{headers:{signature:l(JSON.stringify(e),this.credentials.secretKey)}}),n=[];if(200!=s.status)return this.logger.log(`Download request failed (external): ${s.statusText} ${s.status}`),n;const i=s.data;if(!i.status)return this.logger.log(`Download request failed (internal): ${i.msg}`),n;const r=i.content.invoices;for(const t in r)n.push(r[t].id),await a.writeFile(`${this.cacheDir}/${r[t].id}.invoice`,JSON.stringify(r[t],null,4),"utf-8");return this.logger.log(`Downloaded invoice files from server: \n\t${n.join("\n\t")}`),n}async export(t,e){await this.download(t);const s=[];for(const e in t){const n=await a.readFile(`${this.cacheDir}/${t[e]}.invoice`,"utf-8"),i=JSON.parse(n);s.push(i)}return i(s,{columns:["timestamp","id","description","inputTokens","inputPrice","outputTokens","outputPrice","total"],columnSplitter:e?",":"|"})}},b="1.1.0";let S=!1,D=!1;async function x(t,e,s){let n=new Date;s&&s.timestamp&&(n=new Date(s.timestamp));const a=`${n.getFullYear()}.${n.getMonth()+1}.${n.getDate()}`,i=`${n.toTimeString().substring(0,8)}`;if(v(a+" ").green(i+" ").cyan(t).defaultColor("> : "),s&&s.slowTyping)for(let t=0;t<e.length;t++)process.stdout.write(e.charAt(t)),await o(10);else process.stdout.write(e);v("\n\n")}async function T(){const e=await async function(){const t=new Date,e=await n.get("http://api.fulcrum-ai.dev:11451/ping");if(200!=e.status)throw new Error("Unable to connect to server");const s=new Date;return{ip:e.data.ip,lag:s.getTime()-t.getTime()}}();v.green.bold(`Server connection established from IP ${e.ip}, ping: ${e.lag} ms\n`),v.bold("Process started. \n"),v.on("key",(t=>{y.isLoggedIn()||"CTRL_Q"==t&&(v.red("Exiting program..."),process.exit(0)),y.isLoggedIn()&&"CTRL_L"==t&&async function(){S=!0,g(),v.bold("**Current Announcement**\n"),v(await d()),v("\nPress ESC at any time to exit menu"),v.singleLineMenu(["Status","Settings","Account","Clear Screen","Version","Exit"],{style:v.inverse,selectedStyle:v.defaultColor,cancelable:!0},(async(t,e)=>{if(t)v.red("An error occurred turning on the menu");else{if(v("\n"),await y.sync(),e)switch(e.selectedIndex){case 0:v("Current status: \n"),v(`Account balance: ${y.getBalance()}\n`),v(`Assistant: ${C.getName(y.getCurrAssistant())}\n`);const t=y.getCurrConversation();if(t.length){const e=await I.get(t);v(`Conversation: \nTitle: ${e.title}\tId: ${e.id}\n`)}else v("New conversation\n");break;case 1:g();const e=await v.singleRowMenu(["Assistants","Conversations"],{cancelable:!0}).promise;if(e.canceled){v.red.bold("\nAction canceled\n");break}if(v("\n"),0==e.selectedIndex){g(),await C.download(y.listAssistantIds());const t=y.listAssistantIds(),e=[],s=[];for(const n in t){const a=await C.get(t[n]);e.push(a),s.push(a.name)}v("Available Assistants: \n");const n=await v.singleColumnMenu(s,{cancelable:!0}).promise;if(n.canceled){v.red.bold("\nAction canceled\n");break}y.setCurrAssistant(e[n.selectedIndex].id),v.bold(`\nCurrent assistant: ${n.selectedText}\n`)}else{g(),await I.download(y.listConversationIds());const t=y.listConversationIds(),e=[],s=[];for(const n in t){const a=await I.get(t[n]);e.push(a),s.push(a.title)}s.push("New conversation");const n=await v.singleColumnMenu(s,{cancelable:!0}).promise;if(n.canceled){v.red.bold("\nAction canceled\n");break}n.selectedIndex<e.length?y.setCurrConversation(e[n.selectedIndex].id):y.setCurrConversation(""),v.bold(`\nCurrent conversation: ${n.selectedText}\n`)}break;case 2:v(`Current balance: ${y.getBalance()}`);const s=await v.singleColumnMenu(["Account Summary","Recharge/Top Up"],{cancelable:!0}).promise;if(s.canceled){v.red.bold("\nAction canceled\n");break}if(v("\n"),0==s.selectedIndex){const t=y.listInvoiceIds();await $.download(t);const e=await $.export(t,!0);await a.writeFile("downloads/Account Summary.csv",e,"utf-8"),v('Account summary downloaded to "downloads" folder\n');const s=[],n=[];for(const e in t){const a=await $.get(t[e]);s.push(a),n.push(a.timestamp+"\n"+a.description)}const i=await v.singleColumnMenu(n,{cancelable:!0}).promise;if(i.canceled){v.red.bold("\nAction canceled\n");break}v("\n");const r=s[i.selectedIndex];v(`ID: ${r.id}\t Timestamp: ${r.timestamp}`),v(`Description: ${r.description}\n`),r.inputCost&&(v.table([["Input Tokens","Input Price (USD/1k tokens)","Input Total Costs"],[r.inputTokens.toString(),r.inputPrice.toString(),r.inputCost.toString()],["Output Tokens","Output Price (USD/1k tokens)","Output Total Costs"],[r.outputTokens.toString(),r.outputPrice.toString(),r.outputCost.toString()]]),v("\n")),v.bold(`Total: ${r.total}`)}else{v("Input recharge code/token: ");const t=await v.inputField().promise;if(!t||!t.length){v.red.bold(`Invalid token inputted: ${t}\n`);break}{const e=await y.recharge(t);if(!e.status){v.red.bold(`Operation unsuccessful, reason: ${e.msg}\n`);break}v.green("Operation successful! "),await y.sync(),v.cyan(`Current balance: ${y.getBalance()}`)}}break;case 3:g();break;case 4:v.bold(`\nCurrent client version: ${b}\nSee https://github.com/KevinKWZheng/Fulcrum-Clients for client side download & releases\n`);break;case 5:await v.red("\nAre you sure to exit? [Y/N]\n").yesOrNo({yes:["y","Y","ENTER"],no:["n","N"]}).promise?(v("\nExiting program...\n"),v.processExit(0),await o(2e3)):v.red.bold("\nOperation canceled")}v.inverse("\n\nPress any key to exit"),v.once("key",(async()=>{g(),v.moveTo(1,1);const t=y.getCurrConversation();if(t&&t.length){await I.download([t]);const e=await I.get(t);for(const t in e.messages){const s=e.messages[t];await x(s.username,s.content,{timestamp:s.timestamp})}}S=D=!1,v("\n").saveCursor(),A()}))}}))}()}));let s="";for(;!y.isLoggedIn();){v.saveCursor().eraseDisplayBelow();const t=await v.singleColumnMenu(["Login","Register"]).promise;if(v("\n"),0==t.selectedIndex){v("Log in process initiated.\n"),v("\nUsername: "),s=await v.inputField().promise,v("\nPassword: ");const t=await v.inputField({echoChar:"*"}).promise,e=await y.login(s,t);if(e.status){C.setCredentials(s,t),I.setCredentials(s,t),$.setCredentials(s,t);break}v.red(`Log in failed: ${e.errMsg}`)}else{v.bold("Registration process initiated.\n"),v("\nUsername: "),s=await v.inputField().promise,v("\nEmail: ");const t=await v.inputField().promise;v("\nPassword: ");const e=await v.inputField({echoChar:"*"}).promise;v("\nInvitation Code: ");const n=await v.inputField().promise,a=await y.register(s,e,t,n);if(a.status){C.setCredentials(s,e),I.setCredentials(s,e),$.setCredentials(s,e);break}v.red(`Registration failed: ${a.errMsg}`)}await o(2e3),v.restoreCursor().eraseDisplayBelow()}g(),await y.sync(),await C.download(y.listAssistantIds()),await I.download(y.listConversationIds()),await $.download(y.listInvoiceIds()),t.existsSync("downloads")||t.mkdirSync("downloads"),y.setCurrAssistant(C.getId("GPT-4")),v.green.bold("Log in success!\n"),v("Welcome to Fulcrum AI\nType message directly to chat with AI Assistants\n"),v("Press CTRL_L to see Menu, Settings, and current announcement\n\n"),v.bold(`***Latest announcement from server***\n${await d()}\n\n`),A()}function A(){D||S||(D=!0,v.saveCursor(),v.bold(">>"),v.inputField({},(async(t,e)=>{if(S||!e)return D=!1,void A();if(t)return v.red.bold(`\nAn error occurred: ${t}\n`).saveCursor(),await o(3e3),D=!1,void A();v.restoreCursor().eraseLine().eraseDisplayBelow(),S=!0,await x(y.getUsername(),e);const s=await v.spinner("unboxing-color"),n=await y.sendMessage(e);if(!n.status||!n.content)return v.red.bold(`\nAn error occurred: ${t}\n`).saveCursor(),D=!1,void A();s.animate(!1),v.eraseLine().move(-1,0),await x(C.getName(n.content.assistantId),n.content.message,{slowTyping:!0}),await y.sync(),y.setCurrConversation(n.content.conversationId),S=!1,v("\n"),D=!1,A()})))}new Promise((t=>{T().then((()=>t()))})).then((()=>{}));
//# sourceMappingURL=Client.js.map
