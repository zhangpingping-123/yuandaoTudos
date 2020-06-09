(function(Vue){
    Vue.prototype.getUniqId = function(){
        return Date.now();
    }
    //定义一个本地存储工具
    //获取数据 保存数据
    let tudos_key = "mytudos";
    let mytudos = {};
    mytudos.storageFunc = {
        fetch: function(){
            return JSON.parse(localStorage.getItem(tudos_key) || "[]");
        },        
        save: function(tudos){
            localStorage.setItem(tudos_key,JSON.stringify(tudos))
        }
    }
    window.mytudos = mytudos;
})(Vue)