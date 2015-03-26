# <%= pkg_name %> [![Build Status](http://api.screwdriver.corp.yahoo.com:4080/badge/<%= screwdriver_id %>/component/icon)](http://api.screwdriver.corp.yahoo.com:4080/badge/<%= screwdriver_id %>/component/target)

<%= description %>

## Main Ideas
It's intialized from [fastbreak/crossover](https://git.corp.yahoo.com/fastbreak/crossover/blob/master/docs/INSTRUMENTATION.md), the ideas is to utilize the functionalities of `React`, build the own instrumentation tree instead of DOM manipulations, to optmize the performance of instrumentation, better implementation approach especially for `Single Page App`.

`react-rapid` is built based on `Rapid` transport APIs and implement its own DOM manipulation logic for `React`, i.e., integrate the `React` life cycle events like `componentWillMount`, `componentDidMount` and `componentWillUnmount`.

## Install
```
ynpm install <%= pkg_name %>
```

## Usage

## API

## Test

### Unit

`grunt unit`

### Functional

Locally, via Chrome only:

`grunt functional`

On the selenium grid against a full suite of browsers:

`grunt functional-grid`

## Note
 - https://git.corp.yahoo.com/kaesonho/search-i13n-study
### Meeting Note 3/24
####Cons of Rapid:
 - data-ylk changes across application, rapid does not handle, need to manually fire linkview events etc
 - data duplication on every data-ylk in tree
 - Trigger click or event, info changed (animation), rapid scrapes DOM, causing performance issue during animation
 - separate tree, cheap object to get information (sync or async)
#### How granular is tree:
 - Only applied through mixin on component. leverage `context` from React to pass this down to children. 
#### Caveat:
 - buffer to not beacon too early -> buffer click/linkview beacons until page view beacon has been fired
#### Collecting:
 - Collect data on willMount because parents it executes from parent to child
 - Beacon after didMount
#### Actions Items:
 - Create an shared package like react-i13n, and move the non-search logic into that can be used cross all react project. 
 - The tree part of the shared package might be also used by other framework other than react, e.g., dust , but for now focus on the react, just separate the logic. 
 - Could probably have another meeting to sync up the idea and architecture before start writing the code.
 - Create a single page based on smalls to integrate it.  
