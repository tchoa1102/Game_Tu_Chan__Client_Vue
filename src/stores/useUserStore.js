import { defineStore } from "pinia"

import { AuthService, UserService, SkillService, QuestService, MarketService } from "../services"

export const useUserStore = defineStore('user', {
    state: () => ({
        user: undefined,
        immortalities: [],
        quests: [],
        skills: {}, // all skills (have and not have)
        market: [],
    }),
    getters: {
        isLoggedIn() {
            if (this.user) {
                return true
            }
            return false
        },
        isAdmin() {
            console.log("store > isAdmin: ", this.user)
            if (this.user) {
                return this.user.role == 'admin'
            }
            return false
        },
        getUser() {
            console.log("store > getUser: ", this.user)
            if (this.user) {
                return this.user
            }
            return false
        },
    },
    actions: {
        async logIn(_this) {
            try {
                console.log("store > Log in...")
                this.user = await UserService.get()
                if (!this.getUser) {
                    return _this.$router.push({ name: 'login' })
                }
                console.log("store > user: ", this.user)
                await this.getData()
                console.log("store > skills: ", this.skills)
                console.log("store > immortalities: ", this.immortalities)
                console.log("store > quests: ", this.quests)
                console.log("store > market: ", this.market)
            } catch(e) {
                console.log(e)
                _this.$router.push({ name: 'login' })
            }
        },
        async logOut(_this) {
            this.user = undefined
            await AuthService.logout()
            _this.$router.push({ name: 'login' })
        },
        async getData() {
            try {
                const result = await Promise.all([
                    SkillService.getAll(),
                    UserService.getImmortalities(this.user._id),
                    UserService.getAllQuests(this.user._id),
                    MarketService.getAll(),
                ])
                this.skills = result[0] || {}
                this.immortalities = result[1] || []
                this.quests = result[2] || []
                this.market = result[3] || []
            } catch (error) {
                console.log('GET DATA ERROR!')
            }
        },
        async refreshUser(_this) {
            try {
                this.user = await UserService.get()
                if (!this.getUser) {
                    return _this.$router.push({ name: 'login' })
                }
            } catch (error) {
                console.log(e)
                _this.$router.push({ name: 'login' })
            }
        },
    }
}) 
