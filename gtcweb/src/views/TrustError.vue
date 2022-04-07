<template>
    <div class="container vh-100">
        <div class="row vh-100 align-items-center">
            <div>
                <img alt="Vue logo" src="../assets/Fubon_Group.png"  width="300" height="300"/>
                <h1 class="mt-5">Error ! !</h1>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    beforeRouteLeave(to,from){
        return false;
    }
}
</script>