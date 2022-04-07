<template>
    <div ref="cardlist" @touchstart.passive="touchstart" @touchmove.passive="touchmove" @touchend.passive="touchend">
        <slot></slot>
    </div>
</template>
<script>
import { ref } from '@vue/reactivity';
import { watch } from '@vue/runtime-core';
export default {
    emits:['refresh','loadingMore','movepos','touchend'],
    setup(props,context) {
        //variable
        var cardlist = ref([])
        var startx = ref(0);
        var starty = ref(0);
        var moveEndX = ref(0);
        var moveEndY = ref(0); 
        var props_IsRefresh = ref(false);
        var props_IsLoadingMore = ref(false);

        watch(moveEndY,()=>{
            context.emit('movepos',moveEndY.value/10)
        })
        //methods
        const touchstart=(event)=>{
            startx.value = event.touches[0].clientX;
            starty.value = event.touches[0].clientY;
        }
        const touchmove=(event)=>{
            moveEndX.value = event.touches[0].clientX;
            moveEndY.value = event.touches[0].clientY;
            var X = moveEndX.value-startx.value;
            var Y = moveEndY.value-starty.value;
            var scroll = window.scrollY;
            var browerheight = document.documentElement.clientHeight;
            var componentHeight = cardlist.value.clientHeight;
            //由上往下滑
            if( Math.abs(X) < Math.abs(Y) && Y>0 ){
                if( scroll==0 && props_IsRefresh.value==false ){
                    props_IsRefresh.value=true;
                    context.emit('refresh',props_IsRefresh);
                }
            }
            //由下往上滑
            if( Math.abs(X) < Math.abs(Y) && Y<0){
                if(scroll+browerheight>componentHeight && props_IsLoadingMore.value==false){
                    props_IsLoadingMore.value=true;
                    context.emit('loadingMore' ,props_IsLoadingMore );
                }
            }
        }
        const touchend=()=>{
            var status = {
                "IsLoadingMore":false,
                "IsRefresh":false
            }
            if(props_IsLoadingMore.value){
                props_IsLoadingMore.value=false;
                status.IsLoadingMore = true;
                context.emit('touchend',status);
            }
            if(props_IsRefresh.value){
                props_IsRefresh.value=false;
                status.IsRefresh = true;
                context.emit('touchend',status);
            }
        }


        return{cardlist,touchstart,touchmove,touchend}
    }
}
</script>