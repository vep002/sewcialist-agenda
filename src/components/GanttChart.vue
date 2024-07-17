<template>
    <div ref="gantt"></div>
</template>

<script>
import Gantt from 'frappe-gantt'

export default {
    name: "GanttChart",
    props: {
        tasks: {
            type: Array,
            required: true
        }
    },
    mounted() {
        this.renderGantt()
    },
    watch: {
        tasks() {
            this.renderGantt()
        }
    },
    methods: {
        renderGantt() {
            this.gantt = new Gantt(this.$refs.gantt, this.tasks, {
                on_click: (task) => {
                    console.log(task)
                },
                on_date_change: (task, start, end) => {
                    console.log(task, start, end)
                }
            })
        }

    }
}
    
    
    
</script>