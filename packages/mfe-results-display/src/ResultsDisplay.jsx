import React from 'react';
import PropTypes from 'prop-types';

const ResultsDisplay = ({ summaries }) => {
    return (
        <div className="results-display">
            <h2>Cited Summaries</h2>
            <ul>
                {summaries.map((summary, index) => (
                    <li key={index}>
                        <h3>{summary.title}</h3>
                        <p>{summary.content}</p>
                        <p><em>Cited from: {summary.source}</em></p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

ResultsDisplay.propTypes = {
    summaries: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            content: PropTypes.string.isRequired,
            source: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default ResultsDisplay;
