<template>
    <div class="notfound-page">
        <div class="notfound-box">
            <img src="../../assets/Not Found.png" class="notfound-img">
            <div class="notfound-txt">ERROR 404: Page Not Found (´；ω；`)</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'pageNotFound',
        data () {
            return {
                msg: "ERROR 404: Page Not Found"
            }
        }
    }
</script>

<style>
.notfound-page {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #36393F;
}

.notfound-box {
    position: absolute;
    top: 300px;
    width: 86px;
    height: 102px;
    left: 50%;
    margin-left: -43px;
}

.notfound-img {
    width: 86px;
    height: 102px;
}

.notfound-txt {
    width: 209px;
    height: 18px;
    margin-left: -67px;
    margin-top: 9px;
    text-align: center;
    font-family: Lato;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 18px;
    color: #C4C2C2;
}
</style>
