<template>
    <section class="position-relative top-0 h-100 background">
        <Loading v-if="!already" :process="loadings" :total="totalData"/>

        <!-- Background -->
        <section class="" style="z-index: 1;">
            <img style="height: 100vh;" src="@/assets/img/fight.png" alt="">
        </section>

        <!--  -->
        <section class="position-absolute top-0 start-0 end-0 h-100" style="z-index: 10; background-color: #00000050;">
            <!-- Header -->
            <section class="status-bar" style="height: 150px;">
                <div class="d-inline-flex align-items-center">
                    <span class="fs-5 d-block text-end text-light px-3 py-1" style="width: 400px; background-color: #0099ff70;">{{ store.user.name }}</span>
                    <span class="mx-2" style="color: #ccc;">VS</span>
                    <span class="fs-5 d-block text-start text-light px-3 py-1" style="width: 400px; background-color: #ff000080;">{{ defense }}</span>
                </div>
                <p class="position-relative text-center">
                    <span class="fight-text fight-round">Lượt</span> <span class="ms-3 fight-text fight-round-text">{{ round.index }}</span>
                </p>
            </section>

            <section class="row battle-field ms-5 me-5">
                <!-- you  @load="chanting('you', i, 1000)" -->
                <div class="col">
                    <div v-for="(j, index) of [[7, 4, 1], [8, 5, 2], [9, 6, 3]]" :key="`you-key-temp${index}`" class="row g-0">
                        <div v-for="(i, index) of j" :key="`you-key-${index}`" :class="`col`" style="height: 100px">
                            <template v-if="status?.you[i]">
                                <Avatar @update:loaded="countLoaded" :status="status.you[i]" :avatars="avatars" :states="states" :index="i"/>
                            </template>
                        </div>
                    </div>
                </div>
                <div class="col-2"></div>
                <!-- defense -->
                <div class="col">
                    <div v-for="(j, index) of [[1, 4, 7], [2, 5, 8], [3, 6, 9]]" :key="`defense-key-temp${index}`" class="row g-0">
                        <div v-for="(i, index) of j" :key="`defense-key-${index}`" :class="`col`" style="height: 100px">
                            <template v-if="status?.defense[i]">
                                <Avatar @update:loaded="countLoaded" :status="status.defense[i]" :avatars="avatars" :states="states" :index="i"/>
                            </template>
                            <!-- <div :class="`${status?.defense[i] && status.defense[i].container}`" style="height: 100px">
                            </div> -->
                        </div>
                    </div>
                </div>
            </section>
    
            <!-- Skills -->
            <section>
                <!-- Sky -->
                <template v-for="(value, key, index) in skysState" :key="`sky-key-${index}`">
                    <div
                        :class="`position-fixed top-0 start-0 end-0 d-none ${value.animation} ${key}`"
                        :style="`height: 200px;
                                z-index: 1000; 
                                background-image: url('${value.effect}');
                                background-size: cover; background-repeat: no-repeat; ${value.style};`"
                    ></div>
                </template>
                <!-- Figure -->
                <template v-for="(value, key, index) in figures" :key="`figure-key-${index}`">
                    <div
                        :class="`position-fixed top-0 start-0 d-none ${value.animation} ${key}`"
                        :style="`height: 200px; margin-left: -100px;
                                z-index: 1000; 
                                background-image: url('${value.effect}');
                                background-size: cover; background-repeat: no-repeat; ${value.style};`"
                    ></div>
                    <!-- <img :class="`position-fixed d-inline-block d-none ${key}`" :src="value.image" :style="`z-index: 1000; ${value.style}`" alt=""> -->
                </template>
                <!-- Skill -->
                <template v-for="(value, key, index) in skills" :key="`skill-key-temp-${index}`">
                    <div
                        v-for="(i, index) in value.amount" :key="`skill-key-${index}`"
                        :class="`position-fixed d-none top-0 start-0 ${value.animation} skill-${key.replace(/ /g, '-')}-${i}`"
                        :style="`height: 200px; margin-top: -100px;
                                z-index: 1001; 
                                background-image: url('${loadingSkills[key.replace(/ /g, '-')][i] ? loadingSkills[key.replace(/ /g, '-')][i] : ''}');
                                background-size: cover; background-repeat: no-repeat; ${value.style};`"
                    ></div>
                </template>

            </section>

            <!-- Bottom -->
            <router-view name="bottom-function-fight" />
        </section>

        <Board style="margin-top: -50px;" :isShow="round.index > plot.length">
            <section>
                <!-- Header -->
                <section class="mb-auto">
                    <h3 v-if="resultFight == 'Thắng Lợi'" class="fight-result-victory">
                        {{ resultFight }}
                    </h3>
                    <h3 v-else class="fight-result-failure">{{ resultFight }}</h3>
                </section>

                <!-- Body -->
                <section class="d-flex g-0 flex-column">
                    <div class=" p-2" style="min-width: 500px; min-height: 200px;">
                        <h5 class="text-start">Chiến Tích</h5>

                        <ul class="list-group list-group-flush">
                            <li v-for="(e, i) of receivedAwards" :key="`receivedAward-${i}`" class="list-group-item bg-transparent">
                                <div class="d-flex align-items-center" style="height: 40px;">
                                    <img class="h-100"
                                        :src="`${HTTP_GG_DRIVE}${e?.item.image || e?.skill.image || e?.equip.image}`"
                                        :alt="`${e?.item.name || e?.skill.name || e?.equip.name}`"
                                    >
                                    <p class="pe-1 mb-0 ms-2 border-end">x {{ e.quantity }}</p>
                                    <p class="mb-0 ms-2">
                                        {{ e?.item.name || e?.skill.name || e?.equip.name }}
                                    </p>
                                    <p v-if="e?.item" class="mb-0 ms-2">({{ e?.item && (e?.item.value) }})</p>
                                    <p v-if="e?.equip" class="mb-0 ms-2">
                                        <span>{{ e?.equip && (e?.equip.level.name) }}</span>
                                        <span class="ms-2">{{ e?.equip && (e?.equip.level.level) }}</span>
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div class="mb-5 me-5 text-end">
                        <router-link @click.prevent="$router.back()" class="text-light btn btn-secondary d-inline-flex flex-column align-items-center text-decoration-none" style="opacity: 0.8;" to="">
                            Thoát
                        </router-link>
                    </div>
                </section>
            </section>
        </Board>
    </section>
</template>

<script>
import { HTTP_GG_DRIVE } from '#/env'
import { Avatar, Loading, Board, } from '@/components/index'
import { QuestService, UserService } from '@/services/index'
import {
    Immortality,
    Skill,
    State,
    ActionPlot,
    loadImage
} from '@/util/index'
import { useUserStore } from '#/src/stores'

export default {
    components: { Avatar, Loading, Board, },
    setup() {
        const store = useUserStore()
        return {
            store,
            HTTP_GG_DRIVE
        }
    },
    data() {
        const idQuest = this.$route?.params?.idQuest || undefined
        const idCluster = this.$route?.params?.idCluster || undefined
        const idPlayer = this.$route.params?.idPlayer || undefined
        return {
            already: false,
            idQuest,
            idCluster,
            idPlayer,
            loadings: 0,
            totalData: 1,
            resultFight: 'Thắng Lợi',
            locationSkill: {},
            round: { index: 1, },
            notify: { index: 0 },
            loadingSkills: {},
            receivedAwards: [],
            defense: '',
            avatars: {
                // 'monk': {
                //     'chanting': {
                //         effect: chanting,
                //         animation: 'animation-50-3pic',
                //     },
                //     'chantingFinish':  {
                //         effect: chantingFinish,
                //         animation: 'animation-50-4pic',
                //     },
                // },
            },
            skysState: {

            },
            figures: {
                // magic_ring_normal: new Figure({
                //     name: 'magic_ring_normal',
                //     effect: magic_ring_normal,
                //     style: 'width: 100px; margin-top: -150px;',
                //     animation: '',
                // }),
            },
            skills: { // action skill
                // 'normal': new Skill({
                //     name: 'normal',
                ////     type: 'damage',
                //     amount: 5, // number of skill attend to defense same time
                //     style: 'width: 100px; background-size: 100%; background-position-y: 75%',
                //     animation: '',
                //     startIs: 'you',
                //     delay: 2000, // delay between (sky/figure) and action
                //     effects: {
                //         sky: '',
                //         figure: 'magic_ring_normal', // from you
                //         action: normal_finally, // animation from you -> object / immediately object
                //     }
                // }),
                // 'normal-heal': new Skill({
                //     name: 'normal-heal',
                ////     type: 'heal',
                //     amount: 2, // number of skill attend to defense same time
                //     style: 'width: 100px; background-size: auto; background-position-y: 100%;',
                //     animation: 'animation-100',
                //     startIs: 'object', // sky: from sky / you: from people action skill / object: immediacy from object be attacked, vd skill from earth, ect.
                //     delay: 2000, // delay between (sky/figure) and action
                //     effects: {
                //         sky: '',
                //         figure: 'magic_ring_normal', // from you
                //         action: heal_1s, // animation from you -> object / immediately object
                //     },
                // }),
            },
            states: {
                // fire: new State({
                //     name: 'fire',
                //    // type: 'damage', // damage/heal/'' ('' when effect decrease atk/... not hp or mp)
                //     amount: 1,
                //     effect: fire,
                //     style: '',
                //     animation: 'animation-100-04-2-infinite',
                // })
            },
            status: {
                you: {
                    // 1: new Immortality({
                    //     index: -1,
                    //     avatar: 'monk',
                    //     hp: 1000,
                    //     mp: 100,
                    //     currentHp: 1000,
                    //     currentMp: 100,
                    // }),
                    // 3: new Immortality({
                    //     index: -3,
                    //     avatar: 'monk',
                    //     hp: 1000,
                    //     mp: 100,
                    //     currentHp: 1000,
                    //     currentMp: 100,
                    // }),
                    // 5: new Immortality({
                    //     index: -5,
                    //     avatar: 'monk',
                    //     hp: 1000,
                    //     mp: 100,
                    //     currentHp: 1000,
                    //     currentMp: 100,
                    //     states: ['fire',],
                    // }),
                    // 7: new Immortality({
                    //     index: -7,
                    //     avatar: 'monk',
                    //     hp: 1000,
                    //     mp: 100,
                    //     currentHp: 1000,
                    //     currentMp: 100,
                    // }),
                    // 9: new Immortality({
                    //     index: -9,
                    //     avatar: 'monk',
                    //     hp: 1000,
                    //     mp: 100,
                    //     currentHp: 1000,
                    //     currentMp: 100,
                    // }),
                },
                defense: {
                    // 1: new Immortality({
                    //     index: 1,
                    //     avatar: 'monk',
                    //     hp: 1000,
                    //     mp: 100,
                    //     currentHp: 1000,
                    //     currentMp: 100,
                    //     states: ['fire','fire',],
                    // }),
                    // 3: new Immortality({
                    //     index: 3,
                    //     avatar: 'monk',
                    //     hp: 1000,
                    //     mp: 100,
                    //     currentHp: 1000,
                    //     currentMp: 100,
                    // }),
                    // 5: new Immortality({
                    //     index: 5,
                    //     avatar: 'monk',
                    //     hp: 1000,
                    //     mp: 100,
                    //     currentHp: 1000,
                    //     currentMp: 100,
                    //     states: ['fire',],
                    // }),
                    // 7: new Immortality({
                    //     index: 7,
                    //     avatar: 'monk',
                    //     hp: 1000,
                    //     mp: 100,
                    //     currentHp: 1000,
                    //     currentMp: 100,
                    // }),
                    // 9: new Immortality({
                    //     index: 9,
                    //     avatar: 'monk',
                    //     hp: 1000,
                    //     mp: 100,
                    //     currentHp: 1000,
                    //     currentMp: 100,
                    // }),
                }
            },
            plot: [ // turn // if actor / object < 0 => you else defense
                // { // turn 1
                //     you: {
                //         actor: -1,
                //         effects: [
                //             {
                //                 type: 'skill',
                //                 name: 'normal-heal',
                //                 objects: [-1],
                //                 damages: [],
                //                 heals: ['+200'],
                //             }
                //         ]
                //     },
                //     defense: {
                //         actor: 1,
                //         effects: [
                //             {
                //                 type: 'skill',
                //                 name: 'normal-heal',
                //                 objects: [9],
                //                 damages: [],
                //                 heals: ['+600'],
                //             }
                //         ]
                //     },
                // },
                // { // turn 2
                //     you: {
                //         actor: -3,
                //         effects: [
                //             {
                //                 type: 'skill',
                //                 name: 'normal',
                //                 objects: [5, 1],
                //                 damages: ['-200', '-300'],
                //             },
                //             {
                //                 type: 'action',
                //                 name: 'fire',
                //                 objects: [5],
                //             }
                //         ]
                //     },
                //     defense: {
                //         actor: 3,
                //         effects: [
                //             {
                //                 type: 'skill',
                //                 name: 'normal',
                //                 objects: [-5],
                //                 damages: ['-200'],
                //             },
                //             {
                //                 type: 'action',
                //                 name: 'fire',
                //                 objects: [-5],
                //             }
                //         ]
                //     },
                // },
                // { // turn 3
                //     you: {
                //         actor: -5,
                //         effects: [
                //             {
                //                 type: 'damage',
                //                 damages: ['-50'],
                //             },
                //             {
                //                 type: 'skill',
                //                 name: 'normal',
                //                 objects: [1, 3, 5, 7, 9],
                //                 damages: ['-1000', '-1000', '-100', '-1000', '-1000']
                //             }
                //         ]
                //     },
                //     defense: {
                //         actor: 5,
                //         effects: [
                //             {
                //                 type: 'damage',
                //                 damages: ['-50'],
                //             },
                //             {
                //                 type: 'remove',
                //                 name: 'fire',
                //             },
                //             {
                //                 type: 'skill',
                //                 name: 'normal',
                //                 objects: [-1, -3, -5, -7, -9],
                //                 damages: ['-20000', '-30000', '-10000', '-10000', '-10000'],
                //             },
                //         ]
                //     },
                // },
            ]
        }
    },
    watch: {
        'notify.index'() {
            this.countLoaded()
        },
        loadings(newValue) {
            console.log('newValue: ', newValue, " ", this.loadings, ', total: ', this.totalData)
            if (this.loadings >= this.totalData - 12) {
                this.already = true
            }
        },
        async already() {
            console.log('%c READY FIGHT! ', 'font-size: 40px; font-weight: 700; color: #f629b0; background: #cccccc50; padding: 5px 12px;')
            await new Promise(resolve => {
                return setTimeout(() => {
                    return resolve()
                }, 2000)
            }).then()
            new ActionPlot(this.avatars, this.skysState, this.figures, this.skills, this.states, this.status, this.plot, this.round, this.locationSkill).play()
        },
    },
    async created() {
        await this.store.logIn()
        console.group('%c-- SET UP --', 'color: #fff; background: red; font-size: 16px; padding: 5px 12px;')
        let result = {}
        if (this.idQuest) {
            result = await QuestService.fight(this.idQuest, this.idCluster)
        } else {
            result = await UserService.fightPlayer(this.store.user._id, this.idPlayer)
        }
        console.log('result:', result)
        this.receivedAwards = result.receivedAwards
        this.totalData = result.totalData
        console.log('Total data: ', this.totalData)

        this.avatars = new Object(result.avatars)
        console.log('Avatars', this.avatars)

        this.skills = Object.keys(result.skills).reduce((newObj, key) => {
            newObj[key] = new Skill(result.skills[key])
            this.loadingSkills[key.replace(/ /g, '-')] = {}
            for(let i = 1; i <= newObj[key].amount; i++) {
                this.loadImage(this.loadingSkills[key.replace(/ /g, '-')], i, `${HTTP_GG_DRIVE}${newObj[key].effects.action}`, this.notify)
            }
            return newObj
        }, {})
        console.log(this.loadingSkills)
        console.log('Skills', this.skills)

        this.states = Object.keys(result.states).reduce((newObj, key) => {
            newObj[key] = new State(result.states[key])
            return newObj
        }, {})
        console.log('States', this.states)

        this.status.you = Object.keys(result.status.you).reduce((newObj, key) => {
            // every immortality, every state
            newObj[key] = new Immortality(result.status.you[key])
            return newObj
        }, {})
        this.status.defense = Object.keys(result.status.defense).reduce((newObj, key) => {
            // every immortality, every state
            newObj[key] = new Immortality(result.status.defense[key])
            return newObj
        }, {})
        console.log('Status', this.status)

        this.plot = new Object(result.plot)
        console.log('Plot', this.plot)

        this.resultFight = result.resultFight
        console.log('resultFight', this.resultFight)

        this.locationSkill = result.locationSkill
        console.log('locationSkill', this.locationSkill)

        this.defense = result.defense
        console.groupEnd()
    },
    methods: {
        loadImage,
        countLoaded() {
            this.loadings += 1
        }
    },
    mounted() {}
}
</script>

<style>
.fight-text {
    font-family: 'Inter';
    font-style: italic;
    font-weight: 470;
    font-size: 40px;
    line-height: 52px;
    /* identical to box height */

    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}

.fight-round {
    display: inline-block;

    background: linear-gradient(113.38deg, rgba(0, 0, 0, 0.2) -4.48%, rgba(245, 236, 0, 0) 18.09%), radial-gradient(110.95% 217.39% at 82.09% -31.88%, #F50000 0%, rgba(235, 255, 0, 0.98) 88.5%) /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-variation-settings: 'slnt' -6;
}

.fight-round-text {
    display: inline-block;

    background: linear-gradient(240.09deg, #ED0707 3.74%, rgba(255, 245, 6, 0) 126.72%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-variation-settings: 'slnt' -6;
}

.fight-result-victory {
    font-family: 'Inter';
    font-style: italic;
    font-weight: 470;
    font-size: 57px;
    line-height: 69px;
    /* identical to box height */

    background: linear-gradient(113.38deg, rgba(0, 0, 0, 0.2) -4.48%, rgba(245, 236, 0, 0) 18.09%), radial-gradient(110.95% 217.39% at 82.09% -31.88%, #F50000 9.9%, rgba(239, 157, 0, 0.987665) 82.82%, #5200FF 100%) /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-variation-settings: 'slnt' -6;

    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}

.fight-result-failure {
    font-family: 'Inter';
    font-style: italic;
    font-weight: 470;
    font-size: 57px;
    line-height: 69px;
    /* identical to box height */

    background: linear-gradient(113.38deg, rgba(0, 0, 0, 0.2) -4.48%, rgba(245, 236, 0, 0) 18.09%), radial-gradient(224.93% 427.54% at 50% -108.7%, #000000 0%, rgba(163, 163, 167, 0.987665) 56.47%, rgba(142, 43, 0, 0.987665) 97.09%) /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-variation-settings: 'slnt' -6;

    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}

</style>
