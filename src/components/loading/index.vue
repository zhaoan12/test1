<template>
    <div class="loading">  {{updateColor()}} </div>
    </template>
    
    <script>
    export default {
        name: 'Loading',
        methods: {
            updateColor: function() {
                var r = document.querySelector(':root');
                r.style.setProperty('--LOADING', this.$store.state.loading);
            },
        }
    }
    </script>
    
    <style scoped>
    :root {
        --LOADING: #fbfbfb;
    }
    .loading {
        position: fixed;
        left: 0;
        top: 0;
        background: url('../../assets/loading_gif.gif') center center no-repeat var(--LOADING);
        background-size: 200px 200px;
        width: 100vw;
        height: 100vh;
        z-index: 99;
    }
    </style>