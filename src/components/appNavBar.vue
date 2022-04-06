<template>
    <div>
        <v-app-bar app color="deep-purple accent-4" dark>

            <v-toolbar-title>{{ activeTab == 'tab-main' ? 'Каталог товаров' : 'Корзина'}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon v-if="activeTab == 'tab-main'">
                <v-icon @click="$emit('activeTab', 'tab-cart')">
                    mdi-cart-outline
                </v-icon>
            </v-btn>
            <v-btn icon v-else>
                <v-icon @click="$emit('activeTab', 'tab-main')">
                    mdi-view-grid
                </v-icon>
            </v-btn>
        </v-app-bar>
    </div>
</template>

<script>
export default {
    props: {
        activeTab: String
    },
    data: () => ({
        drawer: false
    }),
}
</script>
