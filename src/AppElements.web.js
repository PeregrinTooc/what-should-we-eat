import { createUseStyles } from 'react-jss'

// Create your Styles. Remember, since React-JSS uses the default preset,
// most plugins are available without further configuration needed.
const useStyles = createUseStyles({
    myButton: {
        color: 'green',
        margin: {
            // jss-expand gives more readable syntax
            top: 5, // jss-default-unit makes this 5px
            right: 0,
            bottom: 0,
            left: 200
        },
        '& span': {
            // jss-nested applies this to a child span
            fontWeight: 'bold' // jss-camel-case turns this into 'font-weight'
        }
    },
    myLabel: {
        fontStyle: 'italic'
    },
    myRow: {
        clear: 'both',
        display: 'table'
    },
    myItem: {
        breakAfter: 'false',
        background: 'white',
        border: 1,
        float: 'left',
        font: { size: 24, weight: 'bold' },
        line: { height: 'auto' },
        height: 'auto',
        margin: { right: -1, top: -1 },
        padding: 10,
        text: { align: 'center' },
        width: 'auto',
    }
})

const List = ({ list }) => (
    <ul>
        {list.map(item => (
            <ListItem key={item.id} item={item} />
        ))}
    </ul>
);

const Box = (content) => (
    <div className={useStyles().myItem}>{content}</div>
)

const ListItem = ({ item }) => (
    <div className={useStyles().myRow}>
        {Box(item.firstname)}
        {Box(item.lastname)}
        {Box(item.year)}
    </div>
);

const Button = ({ children }) => (
    <button className={useStyles().myButton}>
        <span className={useStyles().myLabel}>{children}</span>
    </button>
)

export { Button, List }