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
            if (this.tasks.length === 0) return
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

<style>
    .gantt .bar {
        fill: #9CAF88 !important; /* Sage green fill for task bars */
        stroke: #4E4E33 !important; /* Dark brown outline */
    }

    /* Customizing the completed bar fill (if applicable) */
    .gantt .bar-progress {
    fill: #5A5A42; /* Darker sage green for completed progress */
    }

    /* Customizing the grid lines */
    .gantt .grid .tick {
    stroke: #E0E0E0; /* Lighter grey for the grid lines */
    }

    /* Customizing the text labels */
    .gantt .bar-label, .gantt .tick text {
    fill: #3D3D29; /* Dark brown for task labels and dates */
    font-family: 'Merriweather', serif;
    }

    /* Customizing the grid background */
    .gantt .grid-background {
    fill: #F5F5DC; /* Beige background */
    }

    /* Customizing today marker (if applicable) */
    .gantt .today-line {
    stroke: #E57373; /* Light red for today marker */
    }

    /* Customizing the arrow colors for dependencies */
    .gantt .arrow {
    fill: none;
    stroke: #4E4E33; /* Dark brown for arrows */
    }
</style>