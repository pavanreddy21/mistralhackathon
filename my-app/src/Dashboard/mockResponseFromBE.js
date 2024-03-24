import mockGraphJson from './mockGraph.json';

const MOCK_RESPONSE = [
    {
        title: "Title 1",
        description:
            "Description or summary of particular TitleDescription or summary of particular Title 1Description or summary of particular Title 1DescDescription or summary of particular Title 1Description or summary of particular Title 1Description or summary of particular Title 1Description or summary of particular Title 1Description or summary of particular Title 1Description or summary of particular Title 1Description or summary of particular Title 1Description or summary of particular Title 1Description or summary of particular Title 1Description or summary of particular Title 1Description or summary of particular Title 1ription or summary of particular Title 1 1Description or summary of particular Title 1 ",
        isFirstStep: true,
        currentIndex: 0,
        graphJson: mockGraphJson,
    },
    {
        title: "Title 2",
        description: "Description or summary of particular Title 2",
        currentIndex: 1,
        graphJson: mockGraphJson,
    },
    {
        title: "Title 3",
        description: "Description or summary of particular Title 3",
        currentIndex: 2,
        isLastStep: true,
        graphJson: mockGraphJson,
    },
];


export default MOCK_RESPONSE;