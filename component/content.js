(function(Vue){
    Vue.component("tudos-content",{
        watch: {
            tudos: {
                handler(tudos) {
                    window.mytudos.storageFunc.save(tudos);
                },
                deep: true
            }
        },
       
        data:function(){
            return{
                tudos: window.mytudos.storageFunc.fetch(),
                texts:"",
                inputting:false,
                allCheckLabel:false,
                edit_index:-1, //代表没有在编辑的项
                edit_content:"",//编辑内容的缓存
            }
        },
        directives:{
            "focus":{
                inserted:function(el,binding){
                    el.focus()
                }
            }
        },
        // 计算属性
        computed: {
            visibility:function(){
                return this.$root.visibility;
            },
            // 下拉框开始
            comboBox:function(comboContent,index){
                let comboBox =[];
                this.tudos.forEach((v,i)=>{
                    if(v.title.indexOf(this.texts) != -1) {
                        comboBox.push(v.title);
                    }
                })
                return comboBox
            },
            // 计算备忘项,未完成的项
            num:function(){
                let num = this.tudos.filter((v,i)=>{
                    return !v.completed
                })
                return num
            },
            //过滤后的tudos
            filterTudos:function(){
                if(this.visibility=="all"){
                    return this.tudos
                }else if(this.visibility=="activate"){
                    return this.tudos.filter(function (v,i){
                        return !v.completed//激活项
                    })
                }else{
                    return this.tudos.filter(function (v,i){
                        return v.completed//已完成的项
                    })
                }
            },
            //编辑项和全选之间的状态绑定
            allCheck:function(){
                let allCheck = true;//默认是全选
                this.tudos.map(function(v,i){
                    if(!v.completed){
                        allCheck = false
                    }
                })
                    return allCheck

            }
        },
        methods: {
            //表示顶部输入框正在输入
            showTips:function(){
                this.inputting = true;
            },
            //下拉框点击事件
            addTudoFronmTip:function(tip){
                console.log(this.getUniqId())   
                this.tudos.unshift({
                    title:tip,
                    id:this.getUniqID(),
                    completed:false
                })
                this.inputting = false;
            },
            //下拉框内容被点击了
            hiddenComboBox:function(){
                this.inputting=false

            },
            //点击清除已完成事件
            clearCompleteTudos:function(index){
                console.log("点击了")
                //过滤拿到没有完成的项
                let nocompletedTudo = this.tudos.filter((v,i)=>{
                    return !v.completed //false
                    })
                    this.tudos = nocompletedTudo
            },
            //按esc键撤回输入的内容
            withdrawTudo:function(index){
                
                this.tudos[index].title=this.edit_content;
                console.log(this.tudos[index].title)
                this.edit_content="";
                this.edit_index = -1
            },
            //将修改的内容保存到本地的tudos
            seveTudoContent:function(index){

                if(!this.tudos[index].title){
                    this.tudos.splice(index,1);
                }
                this.edit_index=-1;
            },
            // 双击事件开始
            dblclickTudo:function(index){
                // 拿到它this下面的tudos中的内容
                // console.log(this.tudos[index])
                //保留之前的值
                this.edit_content = this.tudos[index].title
                //记录当前的编辑项
                this.edit_index = index
            },
            // 双击事件结束

            // 添加备忘
            addTodo:function(){
                console.log(this)
                if(!this.texts.trim()){
                    alert("内容不能为空")
                    return
                }            
                this.tudos.unshift({
                    id:this.getUniqId(),                    
                    title:this.texts,
                    completed:false

                });
                this.texts ="";
                this.inputting = false
            },
            // 点击全选
            changeCheckAll:function(){
                this.tudos.forEach((v,i)=>{
                    v.completed = !this.allCheckLabel
                })
                this.allCheckLabel = !this.allCheckLabel
            },

            // 点击删除
            removeTudos:function(index){
                this.tudos.splice(this.tudos.indexOf(index),1)
            }

            },
        template:`
            <section>
            <!-- 备忘录列表开始 -->
            <section class="content">
                <!-- 备忘录输入框开始 -->
                <section class="content-tudos-input">
                    <section class="new-tudo">
                        <input v-focus type="text"  placeholder="输入你的备忘录" v-model="texts"  @input="showTips" @keyup.enter.stop="addTodo">
                        <!-- 下拉框开始 -->
                        <section :class="['hidden',{show:inputting}]">
                             <section class="combobox-item" 
                             v-for="tip,index in comboBox"
                             @click="hiddenComboBox(index)"
                             >{{tip}}</section>
                        </section>
                        <!-- 下拉框结束 -->
                    </section>   
                    <section :class="['checkAllIcon',{allcheck:allCheck}]" @click.stop="changeCheckAll"></section>   
                </section>
                <!-- 备忘录输入框结束 -->
                <ul class= "tudo-lits">
                    <li class="tudo-item" v-for="item,index in filterTudos">
                        <!-- 复选框开始 -->
                        <section class="checkbox">
                            <input type="checkbox" v-model="item.completed"/>
                        </section>
                        <!-- 复选框结束 -->
                        <!-- 代办事项开始 -->
                        <section :class="['midden',{completed:item.completed,hidden:edit_index==index}]" @dblclick.stop="dblclickTudo(index)">                       
                            <!-- 双击修改内容 -->
                            <div>{{item.title}}</div>                      
                        </section>
                        <!-- 代办事项结束 -->
                        <!-- 修改代办事项开始 -->
                        <!--  @blur  绑定失焦事件 -->
                        <section :class="['midden','hidden',{show:edit_index==index}]" >
                                <input type="text" v-model="item.title"
                                @keyup.enter.stop="seveTudoContent(index)"
                                @blur="seveTudoContent(index)"
                                @keyup.esc="withdrawTudo(index)"
                                />
                        </section>
                        <!-- 修改代办事项结束 -->
                        <!-- 删除按钮开始 -->
                        <section class="removeTudos">
                            <div  @click.stop="removeTudos(index)">X</div>
                        </section>
                        <!-- 删除按钮结束 -->
                    </li>
                </ul>
            </section>
            <!-- 备忘录列表结束 -->
            <!-- 备忘录底部功能栏开始 -->
            <section class="buttom">
                <div class="tudo-left">
                    <div class="tudo-num">剩下{{num.length}}项</div>
                </div>
                <div class="middle">
                    <a href="#/all" :class="['all',{activate:visibility=='all'}]" >All</a>
                    <a href="#/activate" :class="['tudo-activate',{activate:visibility=='activate'}]" >激活</a>
                    <a href="#/accomplish" :class="['tudo-accomplish',{activate:visibility=='accomplish'}]" >完成</a>
                </div>
                <div class="right" @click="clearCompleteTudos">
                    清除已完成
                </div>
            </section>
            <!-- 备忘录底部功能栏结束 -->
            </section>
            `
    })

    
})(Vue)