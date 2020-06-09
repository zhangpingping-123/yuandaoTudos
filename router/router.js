(function(){
        // //检车hash值的变化
        // window.addEventListener("hashchange",function(){

        //     console.log(vm.visibility)
        // })
    function handleHashChange(){
        console.log(vm.$root.visibility)
        window.location.hash="";
        vm.$root.visibility="all";
    }
    let routes= [
        {path:"all"},{path:"activate"},{path:"accomplish"}
    ]
    window.addEventListener("hashchange",function(){
        console.log(window.location.hash);
        vm.visibility = window.location.hash.replace("#/","");
        let index = routes.findIndex((v,i)=>{
            if(v.path == vm.visibility){
                return true;
            }
        })
        if(index === -1){
            window.location.hash = "";
            vm.$root.visibility = "all"
        }else{
            vm.$root.visibility = vm.visibility;
        }
    })
    handleHashChange()
})()