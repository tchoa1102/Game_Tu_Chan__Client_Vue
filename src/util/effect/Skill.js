import Effect from './Effect'

class Skill extends Effect {
    Skill(type, name = '', objects = [], damages = [], heals = []) {
        super(type)
        this.name = name
        this.objects = objects
        this.damages = damages
        this.heals = heals
    }
}

export default Skill
