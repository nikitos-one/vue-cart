<template>
    <div>
        <app-nav-bar :activeTab="activeTab"
            v-on:activeTab="($event)=>{ activeTab = $event }"/>
        <v-main>

            <v-tabs-items v-model="activeTab">
                <v-tab-item
                    key="tab-main"
                    value="tab-main"
                    style="width: 1000px; margin: auto"
                >

                    <v-card class="m-1">
                        <v-list class="p-0 my-1 list-goods">
                            <v-row no-gutters class="px-2 list-goods__title" style="height: 50px; line-height: 50px;">
                                <v-col cols="7" class="px-10">Наименование</v-col>
                                <v-col cols="2">Доступно (ед)</v-col>
                                <v-col>Цена</v-col>
                                <v-col></v-col>
                                <v-col></v-col>
                            </v-row>
                            <v-list-group
                                v-for="(category, index) in categories"
                                :key="index"
                                :value="index == 0 ? true : false"
                                sub-group
                            >
                                <template v-slot:activator>
                                    <v-list-item-content>
                                        <v-list-item-title>{{ category }}</v-list-item-title>
                                    </v-list-item-content>
                                </template>
                                <v-hover
                                    v-for="(item, id) in getGoodsInCategory(category)"
                                    :key="id"
                                >
                                    <v-list-item
                                        slot-scope="{ hover }"
                                        link
                                    >

                                        <v-row no-gutters class="px-2" style="height: 50px; line-height: 50px;">
                                            <v-col cols="7">{{ item.name }}</v-col>
                                            <v-col cols="2">{{ item.canAmount }}</v-col>
                                            <v-col>{{ item.price }}</v-col>
                                            <v-col>
                                                <div class="amount">
                                                    <input type="number"
                                                           v-model="item.amount"
                                                           v-if="item.inCart || hover"
                                                    />
                                                </div>
                                            </v-col>
                                            <v-col>
                                                <v-tooltip right :disabled="!item.inCart">
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-btn icon
                                                               v-bind:item="item"
                                                               v-bind="attrs"
                                                               v-on="on"
                                                               @click="()=> {
                                                                    if (!item.inCart) addToCart(id)
                                                               }"
                                                        >
                                                            <v-icon>{{ item.inCart ? 'mdi-cart' : 'mdi-cart-arrow-down' }}</v-icon>
                                                        </v-btn>
                                                    </template>
                                                    <span>Уже в корзине!</span>
                                                </v-tooltip>
                                            </v-col>
                                        </v-row>
                                    </v-list-item>
                                </v-hover>
                            </v-list-group>
                        </v-list>
                    </v-card>
                </v-tab-item>

                <v-tab-item
                    key="tab-cart"
                    value="tab-cart"
                    style="width: 1000px; margin: auto"
                >
                    <v-card class="m-1">
                        <v-btn
                            text
                            color="orange lighten-2"
                            @click="()=>{ activeTab = 'tab-main' }"
                        >
                            <v-icon class="mr-2">mdi-arrow-left</v-icon>
                            Назад к каталогу
                        </v-btn>

                        <v-list class="p-0 my-1 list-goods">
                            <v-row no-gutters class="px-2 list-goods__title" style="height: 50px; line-height: 50px;">
                                <v-col cols="7" class="px-10">Наименование</v-col>
                                <v-col cols="2">Доступно (ед)</v-col>
                                <v-col>Цена</v-col>
                                <v-col></v-col>
                                <v-col></v-col>
                            </v-row>

                            <v-list-item v-for="(item) in goods"
                                         :key="item.id"
                                         v-show="item.inCart"
                                         link
                            >
                                <v-row no-gutters class="px-2" style="">
                                    <v-col cols="7">{{ item.name }}</v-col>
                                    <v-col cols="2">{{ item.canAmount }}</v-col>
                                    <v-col>{{ item.price }}</v-col>
                                    <v-col>
                                        <div class="amount">
                                            <input type="number"
                                                   v-model="item.amount"
                                                   v-if="item.inCart"
                                            />
                                        </div>
                                    </v-col>
                                </v-row>
                            </v-list-item>
                        </v-list>
                    </v-card>
                </v-tab-item>
            </v-tabs-items>
        </v-main>
    </div>
</template>

<script>
import appNavBar from "./appNavBar";
// import agGrid from "./agGrid";
export default {
    components: { appNavBar},
    data: () => ({
        activeTab: 'tab-main',
        categories: [],
    }),
    methods: {
        getDataJSON() {
            this.$store.dispatch('dataJSON/getData');
            this.$store.dispatch('dataJSON/getNames');
            // setInterval(()=> {
            //     this.$store.dispatch('dataJSON/getData');
            //     this.$store.dispatch('dataJSON/getNames');
            // }, 15000)
        },
        addToCart(id) {
            this.goods[id].inCart = true
        },
        getGoodsInCategory(category) {
          return Object.fromEntries(
              Object.entries(this.goods).filter((value) => { return value[1].category == category })
          )
        },
    },
    mounted() {
        this.getDataJSON();
    },
    computed: {
        dataJson() {
            return this.$store.state.dataJSON.data
        },
        namesJson() {
            return this.$store.state.dataJSON.names
        },
        goods() {
            if(!Object.values(this.dataJson).length || !Object.values(this.namesJson).length) return
            let goods = {};
            this.dataJson.map((row) => {
                let category = this.namesJson[row['G']]['G'];
                let id = row['T'];
                let name = this.namesJson[row['G']]['B'][row['T']]['N'];
                let canAmount = row['P'];
                let price = row['C'];

                // if (goods[category] == undefined) {
                //     goods[category] = []
                // }
                if (!this.categories.includes(category)) this.categories.push(category)

                goods[id] = {
                    category: category,
                    name: name,
                    canAmount: canAmount,
                    price: price,
                    amount: 1,
                    inCart: false
                }
            })
            return goods
        }
    }
}
</script>

<style lang="sass">
.v-icon.v-icon::after
    background-color: transparent !important

.v-list
    &.list-goods
        .v-list-group
            border-bottom: 1px solid #cfcfcf
            &:last-of-type
              border-bottom: 0
            .v-list-item
                border-top: 1px solid #cfcfcf
                &:first-of-type
                    border-top: 0
                .amount
                    input
                        width: 50px
                        height: 30px

</style>

